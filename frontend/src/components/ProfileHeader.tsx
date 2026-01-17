'use client'

import { Mail, Shield } from 'lucide-react'
import AvatarUpload from '@/components/AvatarUpload'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileHeader() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-8">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
        <AvatarUpload
          currentAvatarUrl={user.avatar_url}
          userName={`${user.firstName} ${user.lastName}`}
        />
        <div className="flex-1 space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <h2 className="text-2xl font-bold text-foreground">{`${user.firstName} ${user.lastName}`}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium w-fit">
              <Shield className="w-3 h-3" />
              Verified
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {user.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
