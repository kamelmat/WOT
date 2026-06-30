import type {
  AddShoeRequest,
  AddShoeResponse,
  AuthResponse,
  FitProfileSummaryResponse,
  RecommendationsResponse,
  ValidateFitRequest,
  ValidateFitResponse,
  SocialSuggestionsResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from './types'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

let authToken: string | null = null
let onUnauthorized: (() => void) | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler
}

function authHeaders(extra?: HeadersInit): HeadersInit {
  const headers: Record<string, string> = {
    ...(extra as Record<string, string> | undefined),
  }
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`
  }
  return headers
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text()
  if (!text) return `Request failed (${res.status})`
  try {
    const parsed = JSON.parse(text) as { message?: string }
    return parsed.message ?? text
  } catch {
    return text
  }
}

async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(init.headers),
    },
  })

  if (res.status === 401) {
    onUnauthorized?.()
    throw new Error('Session expired. Please sign in again.')
  }

  if (!res.ok) {
    throw new Error(await parseError(res))
  }

  return (await res.json()) as T
}

export const authApi = {
  register: (body: { email: string; password: string }) =>
    requestJson<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    requestJson<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
}

export const fitApi = {
  myProfile: () =>
    requestJson<FitProfileSummaryResponse>('/api/v1/fit/profile/me', { method: 'GET' }),

  addShoe: (body: AddShoeRequest) =>
    requestJson<AddShoeResponse>('/api/v1/fit/add-shoe', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  addShoeWithImage: async ({
    request,
    imageFile,
  }: {
    request: AddShoeRequest
    imageFile: File
  }) => {
    const fd = new FormData()
    fd.append(
      'request',
      new Blob([JSON.stringify(request)], { type: 'application/json' }),
    )
    fd.append('image', imageFile)

    const res = await fetch(`${API_BASE}/api/v1/fit/add-shoe-with-image`, {
      method: 'POST',
      headers: authHeaders(),
      body: fd,
    })

    if (res.status === 401) {
      onUnauthorized?.()
      throw new Error('Session expired. Please sign in again.')
    }

    if (!res.ok) {
      throw new Error(await parseError(res))
    }

    return (await res.json()) as AddShoeResponse
  },

  validate: (body: ValidateFitRequest) =>
    requestJson<ValidateFitResponse>('/api/v1/fit/validate', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  recommendations: (fitProfileId: string) =>
    requestJson<RecommendationsResponse>(
      `/api/v1/fit/recommendations?fitProfileId=${encodeURIComponent(fitProfileId)}`,
      { method: 'GET' },
    ),

  updateProfilePain: (fitProfileId: string, body: UpdateProfileRequest) =>
    requestJson<UpdateProfileResponse>(
      `/api/v1/fit/profile/${encodeURIComponent(fitProfileId)}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    ),

  socialSuggestions: (pain: string) =>
    requestJson<SocialSuggestionsResponse>(
      `/api/v1/fit/social/suggestions?pain=${encodeURIComponent(pain)}`,
      { method: 'GET' },
    ),
}
