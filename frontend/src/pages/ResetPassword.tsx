import { ResetPasswordForm } from '@/components/ResetPasswordForm'
import { Link } from 'react-router-dom'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <svg
                className="w-6 h-6 text-primary"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
              </svg>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reset Your Password
          </h1>
          <p className="text-muted-foreground">
            Enter your email to get started
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
