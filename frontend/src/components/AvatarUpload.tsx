'use client'

import type React from 'react'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import {
  validateFile,
  extractErrorMessage,
  parseJsonSafe,
} from '@/lib/errorHandler'

interface AvatarUploadProps {
  currentAvatarUrl?: string
  userName: string
}

const MAX_FILE_SIZE_MB = 5

export default function AvatarUpload({
  currentAvatarUrl,
  userName,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { refreshUser } = useAuth()

  const handleFileSelect = () => {
    setUploadError(null)
    fileInputRef.current?.click()
  }

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)

    const validationError = validateFile(file, {
      maxSizeMB: MAX_FILE_SIZE_MB,
      allowedTypes: ['image/*'],
    })

    if (validationError) {
      setUploadError(validationError)
      toast.error('Invalid file', {
        description: validationError,
      })
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/avatar`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        await refreshUser()
        setUploadError(null)
        toast.success('Avatar updated', {
          description: 'Your profile picture has been updated successfully',
        })
      } else {
        const result = await parseJsonSafe(response)
        const errorMessage = extractErrorMessage(result)
        setUploadError(errorMessage)
        toast.error('Upload failed', {
          description: errorMessage,
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Network error. Please check your connection and try again.'
      console.error('Avatar upload error:', error)
      setUploadError(errorMessage)
      toast.error('Upload failed', {
        description: errorMessage,
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async () => {
    if (!currentAvatarUrl) return

    setUploadError(null)
    setIsDeleting(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/avatar`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        await refreshUser()
        setUploadError(null)
        toast.success('Avatar removed', {
          description: 'Your profile picture has been removed',
        })
      } else {
        const error = await parseJsonSafe(response)
        const errorMessage = extractErrorMessage(error)
        setUploadError(errorMessage)
        toast.error('Delete failed', {
          description: errorMessage,
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Network error. Please check your connection and try again.'
      console.error('Avatar delete error:', error)
      setUploadError(errorMessage)
      toast.error('Delete failed', {
        description: errorMessage,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-3">
      {uploadError && (
        <div className="p-3 flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          <span>{uploadError}</span>
        </div>
      )}
      <div className="relative group">
        <Avatar className="h-24 w-24 ring-4 ring-primary/20 group-hover:ring-primary/30 transition-all">
          <AvatarImage
            src={currentAvatarUrl || '/placeholder.svg'}
            alt="Profile"
          />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
            {(userName || 'U')[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -right-2 -bottom-2 flex gap-1">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full bg-card border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
            onClick={handleFileSelect}
            disabled={isUploading || isDeleting}
            aria-label="Upload avatar"
            title={`Upload new avatar (Max ${MAX_FILE_SIZE_MB}MB)`}
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
          {currentAvatarUrl && (
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full bg-card border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
              onClick={handleDelete}
              disabled={isDeleting || isUploading}
              aria-label="Delete avatar"
              title="Remove avatar"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
