'use client'

import type React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { Lock, AlertCircle, CheckCircle, KeyRound, Mail } from 'lucide-react'
import { toast } from 'sonner'
import {
  forgotPassword,
  validateResetCode,
  resetPassword,
} from '@/services/authService'

type ResetStep = 'request' | 'validate' | 'reset' | 'success'

// Reusable UI Components
const ErrorAlert = ({ error }: { error: string }) =>
  error ? (
    <div className="mb-6 p-4 flex items-start gap-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <span>{error}</span>
    </div>
  ) : null

const FormContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={cn('flex flex-col gap-6', className)}>
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
      {children}
    </div>
  </div>
)

const SignInLink = () => (
  <p className="mt-8 text-center text-sm text-muted-foreground">
    Remember your password?{' '}
    <Link
      to="/login"
      className="font-medium text-primary hover:text-primary/80 transition-colors"
    >
      Sign in
    </Link>
  </p>
)

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const emailFromUrl = searchParams.get('email') || ''
  const initialStep: ResetStep = emailFromUrl ? 'validate' : 'request'

  const [currentStep, setCurrentStep] = useState<ResetStep>(initialStep)
  const [email, setEmail] = useState(emailFromUrl)
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState('')

  const validateForm = (fields: Record<string, any>): boolean => {
    setValidationError('')

    if (fields.email !== undefined) {
      if (!fields.email.trim()) {
        setValidationError('Email is required')
        return true
      }
      if (!fields.email.includes('@')) {
        setValidationError('Please enter a valid email address')
        return true
      }
    }

    if (fields.code !== undefined) {
      if (!fields.code.trim()) {
        setValidationError('Reset code is required')
        return true
      }
      if (fields.code.length < 4) {
        setValidationError('Reset code must be at least 4 characters')
        return true
      }
    }

    if (fields.password !== undefined) {
      if (!fields.password) {
        setValidationError('New password is required')
        return true
      }
      if (fields.password.length < 6) {
        setValidationError('Password must be at least 6 characters')
        return true
      }
    }

    if (fields.confirmPassword !== undefined) {
      if (!fields.confirmPassword) {
        setValidationError('Please confirm your new password')
        return true
      }
      if (fields.password !== fields.confirmPassword) {
        setValidationError('Passwords do not match')
        return true
      }
    }

    return false
  }

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm({ email })) return

    setIsLoading(true)
    try {
      await forgotPassword(email)
      setCurrentStep('validate')
      toast.success('Reset code sent', {
        description: 'Check your email for the password reset code',
      })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Failed to send reset code'
      setValidationError(msg)
      toast.error('Failed to send reset code', { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleValidateCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm({ email, code })) return

    setIsLoading(true)
    try {
      await validateResetCode(email, code)
      setCurrentStep('reset')
      toast.success('Code validated', {
        description: 'Now enter your new password',
      })
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Invalid or expired reset code'
      setValidationError(msg)
      toast.error('Invalid code', { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm({ password: newPassword, confirmPassword })) return

    setIsLoading(true)
    try {
      await resetPassword(email, code, newPassword)
      setCurrentStep('success')
      toast.success('Password reset successful', {
        description: 'You can now sign in with your new password',
      })
      setTimeout(() => navigate('/login'), 3000)
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Failed to reset password'
      setValidationError(msg)
      toast.error('Password reset failed', { description: msg })
    } finally {
      setIsLoading(false)
    }
  }

  if (currentStep === 'success') {
    return (
      <FormContainer className={className} {...props}>
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-950">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Password Reset Successful
            </h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. <br />
              Redirecting to login...
            </p>
          </div>
        </div>
      </FormContainer>
    )
  }

  if (currentStep === 'request') {
    return (
      <FormContainer className={className} {...props}>
        <ErrorAlert error={validationError} />
        <form onSubmit={handleRequestCode} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email Address
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Enter the email address associated with your account
            </p>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setValidationError('')
                }}
                required
                disabled={isLoading}
                className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Sending Code...' : 'Send Reset Code'}
          </Button>
        </form>
        <SignInLink />
      </FormContainer>
    )
  }

  if (currentStep === 'validate') {
    return (
      <FormContainer className={className} {...props}>
        <ErrorAlert error={validationError} />
        <form onSubmit={handleValidateCode} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setValidationError('')
              }}
              required
              disabled={isLoading}
              className="bg-input border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-foreground"
            >
              Reset Code
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Enter the code sent to your email address
            </p>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="code"
                type="text"
                placeholder="Enter your reset code"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value)
                  setValidationError('')
                }}
                required
                disabled={isLoading}
                className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? 'Validating...' : 'Validate Code'}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <button
            onClick={() => {
              setCurrentStep('request')
              setCode('')
              setValidationError('')
            }}
            className="font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Didn&apos;t receive a code? Send again
          </button>
        </div>
        <SignInLink />
      </FormContainer>
    )
  }

  // Reset password step
  return (
    <FormContainer className={className} {...props}>
      <ErrorAlert error={validationError} />
      <form onSubmit={handleResetPassword} className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-foreground"
          >
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                setValidationError('')
              }}
              required
              disabled={isLoading}
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-foreground"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setValidationError('')
              }}
              required
              disabled={isLoading}
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20"
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full font-semibold"
          disabled={isLoading}
        >
          {isLoading ? 'Resetting Password...' : 'Reset Password'}
        </Button>
      </form>
      <SignInLink />
    </FormContainer>
  )
}
