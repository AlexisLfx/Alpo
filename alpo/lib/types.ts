export interface AnalysisResult {
  transcription: string
  detected: boolean
  detectedPhrases: string[]
  hash: string
  timestamp: number
  registration: MonadRegistration | null
}

export interface MonadRegistration {
  txHash: string
  blockExplorerUrl: string
  timestamp: number
}
