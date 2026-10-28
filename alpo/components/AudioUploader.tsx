'use client'

import { useRef, useState } from 'react'

interface AudioUploaderProps {
  onAudioReady: (file: File) => void
}

export default function AudioUploader({ onAudioReady }: AudioUploaderProps) {
  const [mode, setMode] = useState<'idle' | 'recording' | 'ready'>('idle')
  const [fileName, setFileName] = useState<string | null>(null)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setMode('ready')
    onAudioReady(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (!file || !file.type.startsWith('audio/')) return
    setFileName(file.name)
    setMode('ready')
    onAudioReady(file)
  }

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    chunksRef.current = []

    recorder.ondataavailable = (e) => chunksRef.current.push(e.data)
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      const file = new File([blob], 'grabacion.webm', { type: 'audio/webm' })
      setFileName('grabacion.webm')
      setMode('ready')
      onAudioReady(file)
      stream.getTracks().forEach((t) => t.stop())
    }

    recorder.start()
    mediaRecorderRef.current = recorder
    setMode('recording')
    setRecordingSeconds(0)
    timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000)
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const fmtTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-10
          flex flex-col items-center justify-center gap-3 transition-all
          ${dragOver
            ? 'border-orange-400 bg-orange-50'
            : mode === 'ready'
            ? 'border-green-400 bg-green-50'
            : 'border-gray-200 bg-gray-50 hover:border-orange-300 hover:bg-orange-50/50'}
        `}
      >
        {mode === 'ready' ? (
          <>
            <div className="w-12 h-12 rounded-full bg-green-100 border border-green-300 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-green-600 font-medium">{fileName}</p>
            <p className="text-gray-400 text-sm">Clic para cambiar archivo</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm text-center">
              Arrastra un audio aquí o <span className="text-orange-500 underline">selecciona archivo</span>
            </p>
            <p className="text-gray-400 text-xs">.mp3, .wav, .m4a, .webm, .ogg</p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-400 text-xs">o</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Record button */}
      {mode === 'recording' ? (
        <button
          onClick={stopRecording}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
            bg-red-50 border border-red-300 text-red-500 font-medium
            hover:bg-red-100 transition-all"
        >
          <span className="w-3 h-3 rounded-sm bg-red-500 animate-pulse" />
          Grabando... {fmtTime(recordingSeconds)} — Detener
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl
            bg-gray-50 border border-gray-200 text-gray-600 font-medium
            hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 transition-all"
        >
          <span className="w-3 h-3 rounded-full bg-red-500" />
          Grabar audio ahora
        </button>
      )}
    </div>
  )
}
