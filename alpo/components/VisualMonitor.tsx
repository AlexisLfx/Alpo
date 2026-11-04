'use client';

import { useEffect, useRef, useState } from 'react';

type ScreenResult = {
  text?: string;
  totalWords?: number;
  chatDetected?: boolean;
  chatText?: string;
  chatReason?: string;
  chatTotalWords?: number;
  detected?: boolean;
  detectedPhrases?: string[];
  alertStatus?: 'sent' | 'failed' | 'duplicate' | 'not_needed';
  error?: string;
  captureMode?: 'app' | 'web';
};

type CaptureMode = 'web' | 'app' | 'sidebar';

// Recorta el historial de la conversación según la ventana seleccionada.
function capturarSoloChat(video: HTMLVideoElement, mode: CaptureMode): string {
  const ancho = video.videoWidth;
  const alto = video.videoHeight;

  const region = mode === 'app'
    ? { x: 0.405, y: 0.09, width: 0.585, height: 0.85 }
    : mode === 'sidebar'
      ? { x: 0, y: 0, width: 0.4, height: 0.4 }
      : { x: 0.648, y: 0.588, width: 0.134, height: 0.284 };
  const x = Math.round(ancho * region.x);
  const y = Math.round(alto * region.y);
  const width = Math.round(ancho * region.width);
  const height = Math.round(alto * region.height);

  const canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('No se pudo crear el canvas');
  }

  context.drawImage(
    video,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return canvas.toDataURL('image/jpeg', 0.90);
}

export default function VisualMonitor() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanningRef = useRef(false);

  const [monitoring, setMonitoring] = useState(false);
  const [message, setMessage] = useState('Monitoreo detenido');
  const [detectedText, setDetectedText] = useState('');
  const [chatDetected, setChatDetected] = useState(false);
  const [chatReason, setChatReason] = useState('');
  const [alert, setAlert] = useState(false);
  const [scans, setScans] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  const [detectedPhrases, setDetectedPhrases] = useState<string[]>([]);
  const [error, setError] = useState('');

  const scanScreen = async () => {
    const video = videoRef.current;

    if (!video || video.readyState < 2 || scanningRef.current) {
      return;
    }

    scanningRef.current = true;

    try {
      setError('');

      const image = capturarSoloChat(video, 'web');
      const appImage = capturarSoloChat(video, 'app');
      const sidebarImage = capturarSoloChat(video, 'sidebar');

      const response = await fetch('/api/screen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image, appImage, sidebarImage }),
      });

      if (!response.ok) {
        throw new Error(`Error de API: ${response.status}`);
      }

      const result: ScreenResult = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      const text = result.chatText ?? result.text ?? '';
      const words = result.chatTotalWords ?? result.totalWords ?? 0;

      setDetectedText(text);
      setTotalWords(words);
      setChatDetected(Boolean(result.chatDetected));
      setChatReason(result.chatReason ?? '');

      setAlert(Boolean(result.chatDetected && result.detected));
      setDetectedPhrases(result.detectedPhrases ?? []);

      setScans((previous) => previous + 1);

      if (result.chatDetected) {
        setMessage(result.alertStatus === 'sent' ? 'Alerta enviada por WhatsApp' : result.alertStatus === 'failed' ? 'Riesgo detectado; no se pudo enviar la alerta por WhatsApp' : result.captureMode === 'app' ? 'Chat de la aplicación detectado' : 'Chat del juego detectado');
      } else {
        setMessage('Esperando mensajes del chat...');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';

      console.error('[ALPO MONITOR] Error:', errorMessage);

      setError(errorMessage);
      setMessage('Error al analizar la captura');
    } finally {
      scanningRef.current = false;
    }
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setMonitoring(false);
    setMessage('Monitoreo detenido');
    scanningRef.current = false;
  };

  const startMonitoring = async () => {
    try {
      setError('');
      setMessage('Selecciona la pantalla que deseas compartir...');

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          frameRate: 5,
        },
        audio: false,
      });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        throw new Error('No se encontró el elemento de video');
      }

      video.srcObject = stream;

      await video.play();

      setMonitoring(true);
      setMessage('Monitoreo visual activo');

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        stopMonitoring();
      });

      await scanScreen();

      intervalRef.current = setInterval(() => {
        scanScreen();
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';

      console.error('[ALPO MONITOR] Error al iniciar:', errorMessage);

      setError(errorMessage);
      setMessage('No se pudo iniciar el monitoreo');
      stopMonitoring();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full space-y-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Monitoreo visual ALPO
          </h2>

          <p className="text-sm text-gray-500">
            Análisis de conversaciones privadas mediante reconocimiento de texto.
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            monitoring
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {monitoring ? 'Activo' : 'Inactivo'}
        </span>
      </div>

      <p className="text-sm text-gray-500">
        Comparte la ventana de Roblox o la pantalla donde juegas. ALPO detectará el chat automáticamente.
      </p>

      <div className="flex flex-wrap gap-3">
        {!monitoring ? (
          <button
            onClick={startMonitoring}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Iniciar monitoreo
          </button>
        ) : (
          <button
            onClick={stopMonitoring}
            className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white hover:bg-red-700"
          >
            Detener monitoreo
          </button>
        )}
      </div>

      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-medium text-gray-500">
          Estado del sistema
        </p>

        <p className="mt-1 font-semibold text-gray-900">
          {message}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border p-3">
          <p className="text-sm text-gray-500">Capturas</p>
          <p className="text-2xl font-bold">{scans}</p>
        </div>

        <div className="rounded-lg border p-3">
          <p className="text-sm text-gray-500">Palabras</p>
          <p className="text-2xl font-bold">{totalWords}</p>
        </div>
      </div>

      {chatReason && (
        <p className="text-sm text-gray-500">
          {chatReason}
        </p>
      )}

      {alert && (
        <div className="rounded-lg border border-red-300 bg-red-50 p-4">
          <h3 className="font-bold text-red-700">
            Posible riesgo detectado
          </h3>

          <p className="mt-1 text-sm text-red-600">
            ALPO encontró frases que coinciden con patrones de riesgo.
          </p>

          {detectedPhrases.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm text-red-700">
              {detectedPhrases.map((phrase, index) => (
                <li key={`${phrase}-${index}`}>{phrase}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <h3 className="mb-2 font-semibold text-gray-800">
          Texto reconocido
        </h3>

        <div className="min-h-24 whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 text-sm text-gray-700">
          {detectedText || 'Todavía no se ha reconocido texto.'}
        </div>
      </div>

      <video
        ref={videoRef}
        className="hidden"
        muted
        playsInline
      />
    </div>
  );
}
