import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authApi, setAuthToken, setOnUnauthorized } from '../api/client'
import { clearAuthSession, loadAuthToken, loadStoredUser, saveAuthSession, type StoredUser } from './session'
import { clearFitProfileId } from '../state/persist'

type AuthContextValue = {
  user: StoredUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = loadAuthToken()
    const stored = loadStoredUser()
    if (token && stored) {
      setAuthToken(token)
      setUser(stored)
    }
    setLoading(false)
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    clearAuthSession()
    clearFitProfileId()
    setUser(null)
  }, [])

  useEffect(() => {
    setOnUnauthorized(logout)
    return () => setOnUnauthorized(null)
  }, [logout])

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password })
    const nextUser = { userId: res.userId, email: res.email }
    clearFitProfileId()
    saveAuthSession(res.token, nextUser)
    setAuthToken(res.token)
    setUser(nextUser)
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const res = await authApi.register({ email, password })
    const nextUser = { userId: res.userId, email: res.email }
    clearFitProfileId()
    saveAuthSession(res.token, nextUser)
    setAuthToken(res.token)
    setUser(nextUser)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
