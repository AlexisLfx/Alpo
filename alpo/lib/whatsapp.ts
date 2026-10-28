import { getSocket } from './baileys'

interface NotifyParams {
  transcription: string
  detected: boolean
  detectedPhrases: string[]
  hash: string
  txHash?: string
}

export async function sendAlertToTutor({ transcription, detected, detectedPhrases, hash, txHash }: NotifyParams) {
  const to = process.env.TUTOR_WHATSAPP_NUMBER

  if (!to) {
    console.warn('[whatsapp] TUTOR_WHATSAPP_NUMBER no configurado, omitiendo alerta')
    return
  }

  let body: string

  if (detected && detectedPhrases.length > 0) {
    body =
      `🚨 *ALERTA ALPO — RIESGO DETECTADO* 🚨\n\n` +
      `Se detectaron ${detectedPhrases.length} frase(s) de riesgo en un audio.\n\n` +
      `*Frases detectadas:* ${detectedPhrases.map((p) => `"${p}"`).join(', ')}\n\n` +
      `*Transcripción:*\n"${transcription}"\n\n` +
      `*Hash de evidencia:*\n${hash}` +
      (txHash ? `\n\n*Registrado en Monad:*\n${txHash}` : '')
  } else {
    body =
      `✅ *ALPO — Audio analizado sin riesgo*\n\n` +
      `Se analizó un audio y no se detectaron frases de riesgo.\n\n` +
      `*Transcripción:*\n"${transcription}"\n\n` +
      `*Hash:*\n${hash}`
  }

  const sock = await getSocket()
  const [result] = (await sock.onWhatsApp(to)) ?? []

  if (!result?.exists) {
    throw new Error(`El número ${to} no está registrado en WhatsApp`)
  }

  await sock.sendMessage(result.jid, { text: body })
}
