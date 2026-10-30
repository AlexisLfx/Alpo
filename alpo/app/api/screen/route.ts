
import { NextRequest, NextResponse } from 'next/server'
import { detectRiskPhrases } from '@/lib/detection'
import { createWorker } from 'tesseract.js'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let texto = body.text

    // Si recibimos una imagen, extraemos el texto con OCR
    if (typeof body.image === 'string') {
      const base64 = body.image.replace(/^data:image\/\w+;base64,/, '')
      const imageBuffer = Buffer.from(base64, 'base64')

      const worker = await createWorker('spa+eng')

      try {
        const result = await worker.recognize(imageBuffer)
        texto = result.data.text
      } finally {
        await worker.terminate()
      }
    }

    if (typeof texto !== 'string' || !texto.trim()) {
      return NextResponse.json(
        { error: 'No se recibió texto del chat o no se detectó texto en la imagen' },
        { status: 400 }
      )
    }

    const { detected, phrases } = detectRiskPhrases(texto)

    return NextResponse.json({
      text: texto,
      detected,
      detectedPhrases: phrases,
      timestamp: Date.now(),
      source: body.image ? 'visual_monitor' : 'roblox_screen',
    })
  } catch (error) {
    console.error('[screen] Error analizando contenido:', error)

    return NextResponse.json(
      { error: 'No se pudo analizar el contenido' },
      { status: 500 }
    )
  }
}
