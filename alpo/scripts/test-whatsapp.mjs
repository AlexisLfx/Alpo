import { makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import pino from 'pino'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const AUTH_DIR = path.join(__dirname, '../.baileys_auth')
const TO = '523171209545'

async function main() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)
  const { version } = await fetchLatestBaileysVersion()
  const sock = makeWASocket({ auth: state, version, logger: pino({ level: 'silent' }) })
  sock.ev.on('creds.update', saveCreds)

  sock.ev.on('connection.update', async (update) => {
    console.log('[status]', update.connection ?? '(sin cambio de connection)', update.lastDisconnect?.error?.message ?? '')
    if (update.connection === 'open') {
      const [result] = await sock.onWhatsApp(TO)
      if (!result?.exists) {
        console.error(`El número ${TO} no está registrado en WhatsApp`)
        process.exit(1)
      }
      await sock.sendMessage(result.jid, {
        text: '✅ ALPO — prueba de conexión con Baileys exitosa.',
      })
      console.log('Mensaje enviado')
      process.exit(0)
    }
    if (update.connection === 'close') {
      console.error('Conexión cerrada antes de poder enviar')
      process.exit(1)
    }
  })
}

main()
