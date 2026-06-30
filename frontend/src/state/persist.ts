const KEY = 'wot.fitProfileId'
const PROFILE_KEY = 'wot.profile'

export type UserProfile = {
  name: string
  lengthCm: string
  widthMm: string
  pain: string
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
