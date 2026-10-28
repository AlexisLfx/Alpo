import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, WASocket } from '@whiskeysockets/baileys'
import pino from 'pino'
import path from 'path'

const AUTH_DIR = path.join(process.cwd(), '.baileys_auth')
const logger = pino({ level: 'silent' }) as any

// En desarrollo Next re-evalúa este módulo con cada cambio; si la conexión viviera en una variable del módulo
// se abriría un segundo socket con la misma sesión y WhatsApp cerraría ambos (440 conflict).
const globalState = globalThis as unknown as { __alpoWaPromise?: Promise<WASocket> | null }
const getPromise = () => globalState.__alpoWaPromise ?? null
const setPromise = (p: Promise<WASocket> | null) => { globalState.__alpoWaPromise = p }

function startConnection(): Promise<WASocket> {
  return new Promise((resolve, reject) => {
    ;(async () => {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
      const { version } = await fetchLatestBaileysVersion()
      const socket = makeWASocket({ auth: state, version, logger })

      socket.ev.on('creds.update', saveCreds)

      socket.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update

        if (qr) {
          console.log('\n[baileys] No hay sesión vinculada. Corre "npm run whatsapp:login" para escanear el QR.\n')
        }

        if (connection === 'open') {
          console.log('[baileys] Conectado a WhatsApp')
          resolve(socket)
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode
          if (statusCode === DisconnectReason.loggedOut) {
            console.error('[baileys] Sesión cerrada. Borra .baileys_auth y vuelve a vincular con "npm run whatsapp:login"')
            setPromise(null)
            reject(new Error('Sesión de WhatsApp cerrada'))
          } else {
            console.warn('[baileys] Conexión perdida, reconectando...', statusCode, (lastDisconnect?.error as any)?.message)
            setPromise(new Promise((r) => setTimeout(r, 3000)).then(startConnection))
          }
        }
      })
    })().catch(reject)
  })
}

export function getSocket(): Promise<WASocket> {
  let promise = getPromise()
  if (!promise) {
    promise = startConnection()
    setPromise(promise)
  }
  return promise
}
