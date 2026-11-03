export interface AnalysisResult {
  transcription: string
  detected: boolean
  detectedPhrases: string[]
  hash: string
  timestamp: number
  alertStatus?: 'sent' | 'failed' | 'not_needed'
  registration: MonadRegistration | null
}

export interface MonadRegistration {
  txHash: string
  blockExplorerUrl: string
  timestamp: number
}
