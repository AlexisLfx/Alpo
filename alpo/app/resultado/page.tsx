'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AlertBanner from '@/components/AlertBanner'
import EvidenceCard from '@/components/EvidenceCard'
import type { AnalysisResult, MonadRegistration } from '@/lib/types'

function normalizeText(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// Marca en la transcripción todas las frases detectadas (ignora mayúsculas y acentos, palabra completa).
// normalize('NFD') + quitar diacríticos conserva la longitud de cada letra, así que los índices coinciden.
function highlightPhrases(text: string, phrases: string[]): React.ReactNode {
  if (phrases.length === 0) return text
  const normalized = normalizeText(text)
  const ranges: [number, number][] = []
  // Las más largas primero, para que "ganar dinero fácil" gane sobre "dinero".
  for (const phrase of [...phrases].sort((a, b) => b.length - a.length)) {
    const key = normalizeText(phrase)
    const regex = new RegExp(`(?<![a-z0-9])${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![a-z0-9])`, 'g')
    let m: RegExpExecArray | null
    while ((m = regex.exec(normalized)) !== null) {
      const start = m.index
      const end = start + m[0].length
      if (!ranges.some(([s, e]) => start < e && end > s)) ranges.push([start, end])
    }
  }
  ranges.sort((a, b) => a[0] - b[0])

  const nodes: React.ReactNode[] = []
  let cursor = 0
  ranges.forEach(([start, end], i) => {
    if (start > cursor) nodes.push(text.slice(cursor, start))
    nodes.push(
      <mark key={i} className="bg-red-100 text-red-600 rounded px-0.5 not-italic font-bold">
        {text.slice(start, end)}
      </mark>
    )
    cursor = end
  })
  if (cursor < text.length) nodes.push(text.slice(cursor))
  return nodes
}

export default function ResultadoPage() {
  const router = useRouter()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [registration, setRegistration] = useState<MonadRegistration | null>(null)
  const [registering, setRegistering] = useState(false)
  const [regError, setRegError] = useState<string | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('alpo_result')
    if (!stored) { router.push('/'); return }
    const parsed: AnalysisResult = JSON.parse(stored)
    setResult(parsed)
    if (parsed.registration) setRegistration(parsed.registration)
  }, [router])

  async function handleRegister() {
    if (!result) return
    setRegistering(true)
    setRegError(null)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: result.hash, timestamp: result.timestamp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRegistration(data)
    } catch (err) {
      setRegError(err instanceof Error ? err.message : 'Error al registrar')
    } finally {
      setRegistering(false)
    }
  }

  if (!result) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Nuevo análisis
      </button>

      <h2 className="text-2xl font-black text-gray-900">Resultado del Análisis</h2>

      {/* Alert */}
      {result.detected && result.detectedPhrases.length > 0 && (
        <AlertBanner phrases={result.detectedPhrases} />
      )}

      {!result.detected && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 border border-green-300 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-green-700 font-semibold">Sin frases de riesgo detectadas</p>
            <p className="text-green-500 text-sm">El audio no contiene patrones de reclutamiento conocidos.</p>
          </div>
        </div>
      )}

      {/* Transcription */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-3">
        <h3 className="text-gray-800 font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          Transcripción
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed italic bg-gray-50 border border-gray-100 rounded-lg p-4">
          &ldquo;{highlightPhrases(result.transcription, result.detectedPhrases)}&rdquo;
        </p>
      </div>

      {/* Evidence Card */}
      <EvidenceCard
        hash={result.hash}
        timestamp={result.timestamp}
        onRegister={handleRegister}
        registration={registration}
        registering={registering}
        error={regError}
      />

      {/* Status summary */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-5">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4">Estado del evento</h3>
        <div className="space-y-3">
          {[
            { label: 'Audio procesado', done: true },
            { label: 'Transcripción completada', done: true },
            { label: 'Detección ejecutada', done: true },
            { label: 'Hash generado', done: true },
            { label: 'Alerta al tutor', done: result.detected },
            { label: 'Registrado en Monad', done: !!registration },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                ${item.done ? 'bg-green-100 border border-green-300' : 'bg-gray-100 border border-gray-200'}`}>
                {item.done && (
                  <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className={`text-sm ${item.done ? 'text-gray-700' : 'text-gray-400'}`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
