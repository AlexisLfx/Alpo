'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AudioUploader from '@/components/AudioUploader'
import type { AnalysisResult } from '@/lib/types'

export default function HomePage() {
  const router = useRouter()
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleAnalyze() {
    if (!audioFile) return
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioFile)

      const res = await fetch('/api/analyze', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Error al analizar')

      const result: AnalysisResult = data
      sessionStorage.setItem('alpo_result', JSON.stringify(result))
      router.push('/resultado')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 text-xs text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          Powered by Monad Testnet
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">
          Detectamos el riesgo.
          <br />
          <span className="text-orange-500">Preservamos la evidencia.</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Sube o graba un audio. ALPO lo transcribe, detecta frases de riesgo y registra
          la evidencia de forma inmutable en Monad.
        </p>
      </div>

      {/* Upload card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-8 space-y-6">
        <div>
          <h2 className="font-semibold text-gray-800 mb-1">Paso 1 — Carga el audio</h2>
          <p className="text-gray-400 text-sm">Mensaje de voz, grabación de llamada, etc.</p>
        </div>

        <AudioUploader onAudioReady={setAudioFile} />

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!audioFile || loading}
          className={`
            w-full py-4 rounded-xl font-bold text-base transition-all
            flex items-center justify-center gap-3
            ${audioFile && !loading
              ? 'bg-orange-500 hover:bg-orange-400 text-white glow-orange'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
          `}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analizando audio...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Analizar audio
            </>
          )}
        </button>
      </div>

      {/* How it works */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            step: '01',
            title: 'Transcripción',
            desc: 'Whisper convierte el audio a texto en español',
            color: 'border-blue-200 bg-blue-50',
            dot: 'bg-blue-400',
          },
          {
            step: '02',
            title: 'Detección',
            desc: 'Búsqueda de frases de riesgo como "dinero fácil"',
            color: 'border-red-200 bg-red-50',
            dot: 'bg-red-400',
          },
          {
            step: '03',
            title: 'Blockchain',
            desc: 'Hash inmutable registrado en Monad con timestamp',
            color: 'border-orange-200 bg-orange-50',
            dot: 'bg-orange-400',
          },
        ].map((item) => (
          <div key={item.step} className={`rounded-xl border ${item.color} p-5 space-y-2`}>
            <span className="text-gray-300 font-black text-2xl">{item.step}</span>
            <p className="font-semibold text-gray-700">{item.title}</p>
            <p className="text-gray-400 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
