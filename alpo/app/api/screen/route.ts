
import { NextRequest, NextResponse } from 'next/server'
import { createWorker } from 'tesseract.js'
import path from 'node:path'
import { detectRiskPhrases } from '@/lib/detection'
import { sendAlertToTutor } from '@/lib/whatsapp'
import { createHash } from 'node:crypto'

export const runtime = 'nodejs'
export const maxDuration = 30

const shared = globalThis as unknown as { __alpoScreenAlerts?: Map<string, number> }
const recentAlerts = shared.__alpoScreenAlerts ??= new Map<string, number>()

type Palabra = {
  text: string
  confidence: number
  bbox: {
    x0: number
    y0: number
    x1: number
    y1: number
  }
}

function agruparLineas(palabras: Palabra[]): Palabra[][] {
  const lineas: Palabra[][] = []

  const ordenadas = [...palabras]
    .filter((p) => p.text.trim())
    .sort((a, b) => {
      const centroA = (a.bbox.y0 + a.bbox.y1) / 2
      const centroB = (b.bbox.y0 + b.bbox.y1) / 2
      return centroA - centroB
    })

  for (const palabra of ordenadas) {
    const centroY = (palabra.bbox.y0 + palabra.bbox.y1) / 2

    let linea = lineas.find((actual) => {
      const promedioY =
        actual.reduce(
          (total, p) => total + (p.bbox.y0 + p.bbox.y1) / 2,
          0,
        ) / actual.length

      return Math.abs(promedioY - centroY) <= 12
    })

    if (!linea) {
      linea = []
      lineas.push(linea)
    }

    linea.push(palabra)
    linea.sort((a, b) => a.bbox.x0 - b.bbox.x0)
  }

  return lineas.sort((a, b) => a[0].bbox.y0 - b[0].bbox.y0)
}

function extraerTexto(palabras: Palabra[]): string {
  return agruparLineas(palabras)
    .map((linea) => linea.map((p) => p.text).join(' '))
    .join('\n')
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const image = body.image
    const appImage = body.appImage
    const sidebarImage = body.sidebarImage

    if (
      typeof image !== 'string' ||
      !image.startsWith('data:image/')
    ) {
      return NextResponse.json(
        { error: 'La imagen recibida no es válida.' },
        { status: 400 },
      )
    }

    const workerPath = path.join(
      process.cwd(),
      'node_modules',
      'tesseract.js',
      'src',
      'worker-script',
      'node',
      'index.js',
    )

    console.log('[ALPO OCR] Worker:', workerPath)
    console.log('[ALPO OCR] Procesando recorte exclusivo del chat')

    const worker = await createWorker('spa+eng', 1, {
      workerPath,
      workerBlobURL: false,
    })

    let palabras: Palabra[] = []
    let textoCompleto = ''
    let captureMode: 'app' | 'web' = 'web'

    try {
      if (typeof sidebarImage === 'string' && sidebarImage.startsWith('data:image/') &&
          typeof appImage === 'string' && appImage.startsWith('data:image/')) {
        const sidebar = await worker.recognize(sidebarImage)
        const text = sidebar.data.text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        // Require multiple navigation labels so ordinary chat text does not change the crop.
        const indicators = [/\bchat\b/, /\bbuscar\b/, /\bformar\b|\bequipo\b/, /\bcomunidades\b/]
        if (indicators.filter((pattern) => pattern.test(text)).length >= 2) captureMode = 'app'
      }
      const resultado = await worker.recognize(
        captureMode === 'app' ? appImage : image,
        {},
        { blocks: true },
      )

      textoCompleto = resultado.data.text || ''

      const bloques = resultado.data.blocks || []

      palabras = bloques.flatMap((bloque: any) =>
        (bloque.paragraphs || []).flatMap((parrafo: any) =>
          (parrafo.lines || []).flatMap((linea: any) =>
            (linea.words || []).map((palabra: any) => ({
              text: palabra.text,
              confidence: palabra.confidence,
              bbox: {
                x0: palabra.bbox.x0,
                y0: palabra.bbox.y0,
                x1: palabra.bbox.x1,
                y1: palabra.bbox.y1,
              },
            })),
          ),
        ),
      )

      // Respaldo si Tesseract no devuelve bloques.
      const legacyWords = (resultado.data as typeof resultado.data & { words?: any[] }).words
      if (palabras.length === 0 && legacyWords) {
        palabras = legacyWords.map((palabra: any) => ({
          text: palabra.text,
          confidence: palabra.confidence,
          bbox: {
            x0: palabra.bbox.x0,
            y0: palabra.bbox.y0,
            x1: palabra.bbox.x1,
            y1: palabra.bbox.y1,
          },
        }))
      }
    } finally {
      await worker.terminate()
    }

    const chatText = extraerTexto(palabras)

    console.log('[ALPO OCR] Palabras reconocidas:', palabras.length)
    console.log('[ALPO OCR] Texto completo:', textoCompleto)
    console.log('[ALPO CHAT] Texto del recorte:', chatText)

    // El recorte ya corresponde exclusivamente a la ventana privada.
    const chatDetected = palabras.length > 0 && chatText.length > 0

    const riesgo = chatDetected
      ? detectRiskPhrases(chatText)
      : { detected: false, phrases: [] }

    console.log('[ALPO CHAT] Detectado:', chatDetected)
    console.log('[ALPO CHAT] Total de palabras:', palabras.length)
    console.log('[ALPO RIESGO] Detectado:', riesgo.detected)
    console.log('[ALPO RIESGO] Frases:', riesgo.phrases)

    let alertStatus: 'sent' | 'failed' | 'duplicate' | 'not_needed' = 'not_needed'
    if (riesgo.detected) {
      const now = Date.now()
      recentAlerts.forEach((time, key) => { if (now - time > 60000) recentAlerts.delete(key) })
      const key = createHash('sha256').update(chatText).digest('hex')
      if (recentAlerts.has(key)) {
        alertStatus = 'duplicate'
      } else {
        recentAlerts.set(key, now)
        try {
          await sendAlertToTutor({ transcription: chatText, detectedPhrases: riesgo.phrases, source: 'pantalla' })
          alertStatus = 'sent'
        } catch (error) {
          recentAlerts.delete(key)
          alertStatus = 'failed'
          console.error('[whatsapp] Error enviando alerta visual:', error instanceof Error ? error.message : error)
        }
      }
    }

    return NextResponse.json({
      text: textoCompleto,
      words: palabras,
      totalWords: palabras.length,

      chatDetected,
      chatText,
      chatBounds: null,
      inputBounds: null,

      chatReason: chatDetected
        ? 'Se reconoció texto en la captura exclusiva de la ventana de conversación.'
        : 'No se reconoció texto en la ventana de conversación.',

      chatTotalWords: palabras.length,

      captureMode,
      detected: riesgo.detected,
      detectedPhrases: riesgo.phrases,
      alertStatus,

      timestamp: new Date().toISOString(),
      source: 'ocr-chat-recortado',
    })
  } catch (error) {
    console.error('[ALPO API] Error:', error)

    return NextResponse.json(
      {
        error: 'No se pudo analizar la captura.',
        details:
          error instanceof Error
            ? error.message
            : 'Error desconocido',
      },
      { status: 500 },
    )
  }
}
