export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { writeFileSync, unlinkSync, createReadStream } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { detectRiskPhrases } from '@/lib/detection'
import { generateEvidenceHash } from '@/lib/hash'
import { sendAlertToTutor } from '@/lib/whatsapp'
import { storeEvidenceOnChain } from '@/lib/monad'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  let tmpPath: string | null = null

  try {
    const formData = await req.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No se recibió archivo de audio' }, { status: 400 })
    }

    let transcription: string

    if (process.env.DEMO_MODE === 'true') {
      transcription =
        'Hola, te quería hablar de una oportunidad. Hay una forma de ganar dinero fácil si me ayudas con unas entregas en tu colonia.'
    } else {
      const arrayBuffer = await audioFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const ext = audioFile.name?.split('.').pop() || 'webm'
      tmpPath = join(tmpdir(), `alpo-audio-${Date.now()}.${ext}`)
      writeFileSync(tmpPath, buffer)

      const response = await groq.audio.transcriptions.create({
        file: createReadStream(tmpPath),
        model: 'whisper-large-v3',
        language: 'es',
      })
      transcription = response.text
    }

    const timestamp = Date.now()
    const { detected, phrases } = detectRiskPhrases(transcription)
    const hash = generateEvidenceHash(transcription, timestamp)

    let registration = null
    try {
      registration = await storeEvidenceOnChain(hash, timestamp)
    } catch (e) {
      console.error('[monad] Error registrando evidencia:', e instanceof Error ? e.message : e)
    }

    sendAlertToTutor({
      transcription,
      detected,
      detectedPhrases: phrases,
      hash,
      txHash: registration?.txHash,
    }).catch((e) => console.error('[whatsapp] Error enviando alerta:', e.message))

    return NextResponse.json({
      transcription,
      detected,
      detectedPhrases: phrases,
      hash,
      timestamp,
      registration,
    })
  } catch (err) {
    console.error('[/api/analyze]', err)

    const message =
      err instanceof Error ? err.message : 'Error interno'

    return NextResponse.json({ error: message }, { status: 500 })
  } finally {
    if (tmpPath) {
      try { unlinkSync(tmpPath) } catch {}
    }
  }
}
