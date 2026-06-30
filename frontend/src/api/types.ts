export type FitFeedback = 'TIGHT' | 'PERFECT' | 'LOOSE'

export type AuthResponse = {
  token: string
  userId: string
  email: string
}

export type FitProfileSummaryResponse = {
  fitProfileId: string | null
  confidence: number | null
}

export type AddShoeRequest = {
  brand: string
  model: string
  size: string
  fitFeedback: FitFeedback
  liked?: string
}

export type AddShoeResponse = {
  status: 'FIT_RECORDED'
  fitProfileId: string
  confidence: number
  timestamp: string
}

export type ValidateFitRequest = {
  fitProfileId: string
}

export type ValidateFitResponse = {
  status: 'VALIDATED'
  fitProfileId: string
  confidence: number
  profileState: 'LOW_CONFIDENCE' | 'VALIDATED'
}

export type Recommendation = {
  brand: string
  model: string
  size: string
  fitScore: number
  fitLabel: string
  imageUrl?: string
}

export type RecommendationsResponse = {
  recommendations: Recommendation[]
  confidence: number
}

export type ApiError = {
  errorCode: string
  message: string
  timestamp: string
  traceId?: string
}

export type UpdateProfileRequest = {
  pain?: string
}

export type UpdateProfileResponse = {
  status: string
  fitProfileId: string
}

export type SocialSuggestion = {
  brand: string
  model: string
  size: string
  fitScore: number
  fitLabel: string
  imageUrl?: string
  socialCount: number
}

export type SocialSuggestionsResponse = {
  suggestions: SocialSuggestion[]
}

