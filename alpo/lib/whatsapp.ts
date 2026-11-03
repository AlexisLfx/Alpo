import { getConnectedWhatsApp } from './baileys'

interface NotifyParams {
  transcription: string
  detectedPhrases: string[]
  hash?: string
  txHash?: string
  source?: 'audio' | 'pantalla'
}

export async function sendAlertToTutor({ transcription, detectedPhrases, hash, txHash, source = 'audio' }: NotifyParams) {
  const { socket, recipient } = getConnectedWhatsApp()
  const body =
    `🚨 *ALERTA ALPO — POSIBLE RIESGO* 🚨\n\n` +
    `Se detectaron frases de riesgo en ${source === 'audio' ? 'un audio' : 'una conversación en pantalla'}.\n\n` +
    `*Frases detectadas:* ${detectedPhrases.map((p) => `"${p}"`).join(', ')}\n\n` +
    `*Texto detectado:*\n"${transcription}"` +
    (hash ? `\n\n*Hash de evidencia:*\n${hash}` : '') +
    (txHash ? `\n\n*Registrado en Monad:*\n${txHash}` : '')
  await socket.sendMessage(recipient, { text: body })
}
