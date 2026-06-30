const TOKEN_KEY = 'wot.authToken'
const USER_KEY = 'wot.authUser'

export type StoredUser = {
  userId: string
  email: string
}

export function loadAuthToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function saveAuthSession(token: string, user: StoredUser) {
  sessionStorage.setItem(TOKEN_KEY, token)
  sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function loadStoredUser(): StoredUser | null {
  try {
    const raw = sessionStorage.getItem(USER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredUser>
    if (typeof parsed.userId === 'string' && typeof parsed.email === 'string') {
      return { userId: parsed.userId, email: parsed.email }
    }
    return null
  } catch {
    return null
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}
