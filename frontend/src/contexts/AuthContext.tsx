import { createContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

export interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  avatar_url?: string
}

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, firstName: string, lastName: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  clearError: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const clearError = () => setError(null)

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/current`, {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        const userData = data.data || data
        setUser({
          id: userData.id || userData.userId || userData.sub,
          email: userData.email,
          firstName: userData.firstName || userData.given_name || userData.name || '',
          lastName: userData.lastName || userData.family_name || '',
          avatar_url: userData.avatarUrl || userData.avatar_url || userData.picture,
        })
        localStorage.setItem('isAuthenticated', 'true')
        setError(null)
      } else {
        setUser(null)
        localStorage.removeItem('isAuthenticated')
      }
    } catch (error) {
      setUser(null)
      localStorage.removeItem('isAuthenticated')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Login failed: ${response.status}`)
      }

      await fetchCurrentUser()
      navigate('/profile')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (email: string, firstName: string, lastName: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, lastName, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Registration failed: ${response.status}`)
      }

      navigate(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
    } finally {
      setUser(null)
      localStorage.removeItem('isAuthenticated')
      setError(null)
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshUser: fetchCurrentUser,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  )
}
