import { createHash } from 'crypto'

export function generateEvidenceHash(transcription: string, timestamp: number): string {
  const payload = JSON.stringify({ transcription, timestamp })
  return createHash('sha256').update(payload, 'utf8').digest('hex')
}
