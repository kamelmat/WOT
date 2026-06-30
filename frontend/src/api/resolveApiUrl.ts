const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

/** Prefix backend-relative paths (e.g. /uploads/…) with VITE_API_BASE_URL in production. */
export function resolveApiUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined
  if (path.startsWith('blob:') || path.startsWith('data:')) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  if (path.startsWith('/')) return `${API_BASE}${path}`
  return path
}
