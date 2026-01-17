'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { refreshUser } = useAuth()
  const email = searchParams.get('email')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!email) navigate('/register')
    else inputRef.current?.focus()
  }, [email, navigate])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/email/verify-email`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, code }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Verification failed')
      }

      await refreshUser()
      navigate('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
      setCode('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError('')
    setSuccess('')
    setResendLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/email/resend-verification-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      )

      if (!response.ok) throw new Error('Failed to resend code')
      setSuccess('Verification code sent!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Mail className="w-6 h-6 text-primary" />
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Verify your email
          </h1>
          <p className="text-muted-foreground">
            Enter the verification code sent to{' '}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
          <form onSubmit={handleVerify} className="space-y-5">
            {error && (
              <div className="p-4 flex items-start gap-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 flex items-start gap-3 text-sm text-primary bg-primary/10 border border-primary/20 rounded-lg">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-foreground"
              >
                Verification Code
              </label>
              <Input
                ref={inputRef}
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={isLoading}
                className="bg-input border-border focus:border-primary focus:ring-primary/20 text-center text-lg tracking-widest font-mono"
              />
            </div>

            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent border-border hover:bg-accent hover:border-primary/30"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
