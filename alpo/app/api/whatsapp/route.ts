import { NextResponse } from 'next/server'
import { connectWhatsApp, getWhatsAppStatus, restoreSender } from '@/lib/baileys'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// qrcode-terminal already includes a QR encoder; return its matrix for local rendering.
const QRCode = require('qrcode-terminal/vendor/QRCode')
const errorLevel = require('qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel')

export async function GET() {
  await restoreSender()
  const { status, qr, error } = getWhatsAppStatus()
  const senderStatus = getWhatsAppStatus('sender').status
  let modules: boolean[][] | undefined
  if (qr) {
    const code = new QRCode(-1, errorLevel.L)
    code.addData(qr)
    code.make()
    modules = code.modules
  }
  return NextResponse.json({ status, modules, error, senderStatus }, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST() {
  void connectWhatsApp()
  return NextResponse.json({ status: getWhatsAppStatus().status }, { headers: { 'Cache-Control': 'no-store' } })
}
