import { useAuth } from '@/hooks/useAuth'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { LoadingSpinner } from './LoadingSpinner'

interface RouteGuardProps {
  children: ReactNode
  requireAuth: boolean
  redirectTo: string
}

export function RouteGuard({
  children,
  requireAuth,
  redirectTo,
}: RouteGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingSpinner />

  const isAuthenticated = !!user
  const shouldDeny = requireAuth ? !isAuthenticated : isAuthenticated

  if (shouldDeny) return <Navigate to={redirectTo} replace />

  return <>{children}</>
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth={true} redirectTo="/login">
      {children}
    </RouteGuard>
  )
}

export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth={false} redirectTo="/profile">
      {children}
    </RouteGuard>
  )
}
