const KEY = 'wot.fitProfileId'
const PROFILE_KEY = 'wot.profile'
const FAVORITES_KEY = 'wot.favorites'

export type UserProfile = {
  name: string
  lengthCm: string
  widthMm: string
  pain: string
}

export type StoredFavorite = {
  brand: string
  model: string
  size: string
  fitScore: number
  fitLabel: string
  blurb?: string
  buyUrl?: string
  imageUrl?: string
  imageVariant?: 'left' | 'right'
}

export function loadFitProfileId(): string | null {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function saveFitProfileId(id: string) {
  localStorage.setItem(KEY, id)
}

export function clearFitProfileId() {
  localStorage.removeItem(KEY)
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { name: 'User', lengthCm: '—', widthMm: '—', pain: '' }
    const parsed = JSON.parse(raw) as Partial<UserProfile>
    return {
      name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name : 'User',
      lengthCm: typeof parsed.lengthCm === 'string' && parsed.lengthCm.trim() ? parsed.lengthCm : '—',
      widthMm: typeof parsed.widthMm === 'string' && parsed.widthMm.trim() ? parsed.widthMm : '—',
      pain: typeof parsed.pain === 'string' ? parsed.pain : '',
    }
  } catch {
    return { name: 'User', lengthCm: '—', widthMm: '—', pain: '' }
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
}

export function loadFavorites(): StoredFavorite[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is StoredFavorite =>
        item != null &&
        typeof item === 'object' &&
        typeof item.brand === 'string' &&
        typeof item.model === 'string' &&
        typeof item.size === 'string',
    )
  } catch {
    return []
  }
}

export function saveFavorites(favorites: StoredFavorite[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
}

export function clearFavorites() {
  localStorage.removeItem(FAVORITES_KEY)
}
