'use client'

import { useEffect, useState } from 'react'

type Status = { status: 'disconnected' | 'connecting' | 'qr' | 'connected' | 'error'; modules?: boolean[][]; error?: string; senderStatus?: Status['status'] }

export default function WhatsAppLink() {
  const [state, setState] = useState<Status>({ status: 'disconnected' })
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function refresh() {
      try {
        const response = await fetch('/api/whatsapp', { cache: 'no-store' })
        if (!response.ok) throw new Error('No se pudo consultar WhatsApp')
        const next = await response.json()
        if (active) { setState(next); setError('') }
      } catch {
        if (active) setError('No se pudo consultar el estado de WhatsApp.')
      }
    }
    void refresh()
    const timer = setInterval(refresh, 2000)
    return () => { active = false; clearInterval(timer) }
  }, [])

  async function connect() {
    setError('')
    setState({ status: 'connecting' })
    try {
      const response = await fetch('/api/whatsapp', { method: 'POST' })
      if (!response.ok) throw new Error()
    } catch {
      setError('No se pudo iniciar la conexión.')
      setState({ status: 'disconnected' })
    }
  }

  const size = state.modules?.length ?? 0
  return (
    <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 space-y-4">
      <div>
        <h2 className="font-semibold text-gray-800">WhatsApp del padre o tutor</h2>
        <p className="text-sm text-gray-500 mt-1">Vincula tu cuenta para recibir alertas desde el número emisor de ALPO. Al escanear, autorizas a ALPO como dispositivo vinculado de tu cuenta.</p>
      </div>
      {state.status === 'connected' ? (
        <p className="text-sm font-medium text-green-700">Cuenta del tutor vinculada. Las alertas llegarán a este número.</p>
      ) : state.status === 'qr' && state.modules ? (
        <div className="space-y-3">
          <p className="text-sm text-gray-600">En tu teléfono abre WhatsApp → Dispositivos vinculados → Vincular un dispositivo y escanea este código.</p>
          <svg role="img" aria-label="Código QR para vincular WhatsApp" viewBox={`0 0 ${size + 8} ${size + 8}`} className="w-64 max-w-full bg-white border border-gray-200" shapeRendering="crispEdges">
            <rect width="100%" height="100%" fill="white" />
            {state.modules.flatMap((row, y) => row.map((dark, x) => dark ? <rect key={`${x}-${y}`} x={x + 4} y={y + 4} width="1" height="1" fill="black" /> : null))}
          </svg>
          <p className="text-xs text-gray-500">El código se actualiza automáticamente. Solo muestra este código a quien vaya a vincular su cuenta.</p>
        </div>
      ) : state.status === 'connecting' ? (
        <p className="text-sm text-gray-500">Conectando con WhatsApp...</p>
      ) : (
        <button type="button" onClick={connect} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-600">Vincular WhatsApp</button>
      )}
      <p className="text-xs text-gray-500">Número emisor: {state.senderStatus === 'connected' ? 'conectado' : state.senderStatus === 'connecting' ? 'conectando' : 'no conectado; configúralo en el servidor'}</p>
      {(error || state.error) && <p role="alert" className="text-sm text-red-600">{error || state.error}</p>}
    </section>
  )
}
