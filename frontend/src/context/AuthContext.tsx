import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

interface UserProfile {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthContextValue {
  user: UserProfile | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    full_name: string
    role?: string
  }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const STORAGE_KEY = 'seatsafe_auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as { user: UserProfile; token: string }
      setUser(parsed.user)
      setToken(parsed.token)
    } catch {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    if (user && token) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, [user, token])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const data = res.data?.data
    setUser(data.user)
    setToken(data.token)
    navigate('/')
  }

  const register = async (payload: {
    email: string
    password: string
    full_name: string
    role?: string
  }) => {
    // Default to 'attendee' role if not specified
    const registrationData = {
      ...payload,
      role: payload.role || 'attendee'
    }
    const res = await api.post('/auth/register', registrationData)
    const data = res.data?.data
    setUser(data.user)
    setToken(data.token)
    navigate('/')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    navigate('/login')
  }

  const value = useMemo(
    () => ({ user, token, login, register, logout }),
    [user, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

