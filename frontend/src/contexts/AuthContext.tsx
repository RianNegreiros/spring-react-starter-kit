import { createContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  getCurrentUser,
  login as loginService,
  register as registerService,
  logout as logoutService,
  type User,
} from '@/services/authService'

export interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => Promise<void>
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

  const handleError = (message: string) => {
    setError(message)
    toast.error(message)
  }

  const refreshUser = async () => {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
      setError(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user'
      setUser(null)
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (email: string, password: string) => {
    setError(null)

    try {
      await loginService(email, password)
      const userData = await getCurrentUser()
      if (userData) {
        setUser(userData)
        navigate('/profile')
      } else {
        throw new Error('Failed to load user data after login')
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      handleError(message)
      throw err
    }
  }

  const register = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string
  ) => {
    setError(null)

    try {
      await registerService(email, firstName, lastName, password)
      toast.success('Registration successful', {
        description: 'Please check your email to verify your account',
      })
      navigate(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      handleError(message)
      throw err
    }
  }

  const logout = async () => {
    try {
      await logoutService()
    } finally {
      setUser(null)
      setError(null)
      navigate('/login')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
