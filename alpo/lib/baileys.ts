import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, jidNormalizedUser, WASocket } from '@whiskeysockets/baileys'
import pino from 'pino'
import path from 'path'
import { rm, access } from 'fs/promises'

type Role = 'recipient' | 'sender'
const authDir = (role: Role) => path.join(process.cwd(), role === 'sender' ? '.baileys_sender_auth' : '.baileys_auth')
type ConnectionStatus = 'disconnected' | 'connecting' | 'qr' | 'connected' | 'error'
type State = { status: ConnectionStatus; qr?: string; socket?: WASocket; starting: boolean; error?: string; loggedOut?: boolean; generation: number }
const globalState = globalThis as unknown as { __alpoWhatsAppRoles?: Record<Role, State> }
const states = globalState.__alpoWhatsAppRoles ??= {
  recipient: { status: 'disconnected', starting: false, generation: 0 },
  sender: { status: 'disconnected', starting: false, generation: 0 },
}

export function getWhatsAppStatus(role: Role = 'recipient') {
  const state = states[role]
  return { status: state.status, qr: state.qr, error: state.error }
}

export async function restoreSender() {
  if (states.sender.status !== 'disconnected' || states.sender.loggedOut) return
  try { await access(path.join(authDir('sender'), 'creds.json')) } catch { return }
  void connectWhatsApp('sender')
}

export async function connectWhatsApp(role: Role = 'recipient') {
  const state = states[role]
  if (state.starting || state.status === 'connected' || state.status === 'qr') return
  state.starting = true
  state.status = 'connecting'
  state.error = undefined
  const generation = ++state.generation
  try {
    if (state.loggedOut) {
      await rm(authDir(role), { recursive: true, force: true })
      state.loggedOut = false
    }
    const { state: auth, saveCreds } = await useMultiFileAuthState(authDir(role))
    const { version } = await fetchLatestBaileysVersion()
    const socket = makeWASocket({ auth, version, logger: pino({ level: 'silent' }) as any })
    state.socket = socket
    socket.ev.on('creds.update', saveCreds)
    socket.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
      if (generation !== state.generation) return
      if (qr && role === 'sender') {
        state.status = 'error'
        state.error = 'Vuelve a vincular el número emisor con npm run whatsapp:login y reinicia la aplicación.'
        state.starting = false
        socket.end(undefined)
        return
      }
      if (qr) {
        state.qr = qr
        state.status = 'qr'
        state.starting = false
      }
      if (connection === 'open') {
        state.status = 'connected'
        state.qr = undefined
        state.starting = false
      }
      if (connection === 'close') {
        if (state.status === 'error') return
        state.socket = undefined
        state.qr = undefined
        state.starting = false
        const code = (lastDisconnect?.error as any)?.output?.statusCode
        state.loggedOut = code === DisconnectReason.loggedOut
        state.status = state.loggedOut ? 'disconnected' : 'connecting'
        if (!state.loggedOut) setTimeout(() => { if (generation === state.generation) void connectWhatsApp(role) }, 3000)
      }
    })
  } catch (error) {
    if (generation !== state.generation) return
    state.starting = false
    state.status = 'error'
    state.error = error instanceof Error ? error.message : 'No se pudo iniciar WhatsApp'
  }
}

export function getConnectedWhatsApp() {
  const sender = states.sender
  const recipient = states.recipient
  if (sender.status !== 'connected' || !sender.socket?.user?.id) throw new Error('El WhatsApp emisor no está conectado')
  if (recipient.status !== 'connected' || !recipient.socket?.user?.id) throw new Error('El WhatsApp del tutor no está vinculado')
  const recipientJid = jidNormalizedUser(recipient.socket.user.id)
  if (recipientJid === jidNormalizedUser(sender.socket.user.id)) throw new Error('El emisor y el tutor deben usar números distintos')
  return { socket: sender.socket, recipient: recipientJid }
}
