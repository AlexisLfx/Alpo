import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ALPO — Protección Digital para Menores',
  description: 'Detectamos riesgo y preservamos evidencia antes de que desaparezca.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#fafaf8] text-gray-900 antialiased">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-sm text-white">
              A
            </div>
            <span className="font-bold text-lg tracking-wide text-gray-900">ALPO</span>
            <span className="text-gray-400 text-sm hidden sm:block">
              — Protección Digital para Menores
            </span>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-xs text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full font-medium">
                Monad Testnet
              </span>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
      </body>
    </html>
  )
}
