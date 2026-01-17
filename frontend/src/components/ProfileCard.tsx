'use client'

import ProfileHeader from './ProfileHeader'
import ProfileContent from './ProfileContent'
import { useAuth } from '@/hooks/useAuth'

export default function ProfileCard() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>
        <ProfileHeader />
        <ProfileContent />
      </div>
    </main>
  )
}
