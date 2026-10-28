import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import qrcode from 'qrcode-terminal'
import pino from 'pino'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_DIR = path.join(__dirname, '../.baileys_auth')

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({ auth: state, version, logger: pino({ level: 'silent' }) })

  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('\nEscanea este QR desde WhatsApp > Dispositivos vinculados > Vincular un dispositivo:\n')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'open') {
      console.log('\n✅ Conectado y vinculado correctamente. Sesión guardada en .baileys_auth/')
      console.log('Ya puedes cerrar este script (Ctrl+C) y correr la app normalmente.\n')
    }

    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode
      if (statusCode === DisconnectReason.loggedOut) {
        console.error('Sesión cerrada, borra .baileys_auth/ y vuelve a intentar.')
        process.exit(1)
      } else {
        console.warn('Conexión cerrada, reintentando...', statusCode, lastDisconnect?.error?.message, lastDisconnect?.error?.stack)
        main()
      }
    }
  })
}

main()
