'use client'

import { useState } from 'react'
import type { MonadRegistration } from '@/lib/types'

interface EvidenceCardProps {
  hash: string
  timestamp: number
  onRegister: () => Promise<void>
  registration: MonadRegistration | null
  registering: boolean
  error: string | null
}

export default function EvidenceCard({
  hash,
  timestamp,
  onRegister,
  registration,
  registering,
  error,
}: EvidenceCardProps) {
  const [copied, setCopied] = useState(false)

  function copyHash() {
    navigator.clipboard.writeText(hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const date = new Date(timestamp).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'medium',
  })

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 space-y-5">
      <h3 className="text-gray-800 font-semibold flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500" />
        Registro de Evidencia
      </h3>

      {/* Hash */}
      <div className="space-y-1">
        <p className="text-gray-400 text-xs uppercase tracking-wider">Hash SHA-256</p>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          <code className="text-orange-600 text-xs flex-1 break-all font-mono">{hash}</code>
          <button
            onClick={copyHash}
            className="text-gray-400 hover:text-gray-700 transition-colors flex-shrink-0"
            title="Copiar hash"
          >
            {copied ? (
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Timestamp */}
      <div className="space-y-1">
        <p className="text-gray-400 text-xs uppercase tracking-wider">Timestamp</p>
        <p className="text-gray-700 text-sm font-mono">{date}</p>
        <p className="text-gray-400 text-xs">{timestamp} ms (Unix)</p>
      </div>

      {/* Monad Registration */}
      {!registration ? (
        <div className="pt-2">
          {error && (
            <p className="text-red-500 text-xs mb-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          <button
            onClick={onRegister}
            disabled={registering}
            className={`
              w-full py-3 rounded-xl font-semibold transition-all
              flex items-center justify-center gap-2
              ${registering
                ? 'bg-orange-100 text-orange-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-400 text-white glow-orange'}
            `}
          >
            {registering ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Registrando en Monad...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Registrar Hash en Monad Testnet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-green-100 border border-green-300 flex items-center justify-center">
              <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-600 font-semibold text-sm">Registrado en Monad Testnet</span>
          </div>

          <div className="space-y-1">
            <p className="text-gray-400 text-xs uppercase tracking-wider">TX Hash</p>
            <code className="text-green-600 text-xs font-mono break-all bg-green-50 border border-green-200 rounded-lg px-3 py-2 block">
              {registration.txHash}
            </code>
          </div>

          <a
            href={registration.blockExplorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm transition-colors font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Ver en Monad Explorer
          </a>
        </div>
      )}
    </div>
  )
}
