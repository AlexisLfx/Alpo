export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { storeEvidenceOnChain } from '@/lib/monad'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { hash, timestamp } = body as { hash: string; timestamp: number }

    if (!hash || !timestamp) {
      return NextResponse.json({ error: 'hash y timestamp son requeridos' }, { status: 400 })
    }

    const result = await storeEvidenceOnChain(hash, timestamp)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/register]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error al registrar en Monad' },
      { status: 500 }
    )
  }
}
