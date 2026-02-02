import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { ArrowRight, Database, Layout, Shield, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import FeatureCard from './FeatureCard'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Subtle gradient glow effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-150 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                Full-Stack Starter Kit
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
              Build Modern Apps
              <br />
              <span className="text-primary">Faster Than Ever</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
              A production-ready starter kit combining Spring Boot backend with
              React frontend. Features JWT authentication, PostgreSQL, and
              Docker out of the box.
            </p>

            {/* CTA Buttons */}
            {!user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 font-semibold px-8"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto px-8 font-semibold bg-transparent border-border hover:bg-accent hover:border-primary/30"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4">
                <Link to="/profile">
                  <Button size="lg" className="gap-2 font-semibold px-8">
                    Go to Profile
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Built with modern technologies and best practices for
            production-ready applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Database className="w-6 h-6" />}
            title="Database Ready"
            description="PostgreSQL with Flyway migrations for reliable data management"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6" />}
            title="Secure Auth"
            description="JWT + OAuth2 with email verification and password reset"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Lightning Fast"
            description="Optimized React frontend with Vite for instant HMR"
          />
          <FeatureCard
            icon={<Layout className="w-6 h-6" />}
            title="Modern UI"
            description="Tailwind CSS + shadcn/ui with dark/light theme support"
          />
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Backend Stack Card */}
          <div className="group p-8 rounded-xl border border-border bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Backend Stack
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                'Spring Boot 4 + Java 21',
                'Spring Security + JWT + OAuth2',
                'PostgreSQL + Flyway',
                'Maven + Lombok',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Frontend Stack Card */}
          <div className="group p-8 rounded-xl border border-border bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <svg
                  className="w-6 h-6 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Frontend Stack
              </h3>
            </div>
            <ul className="space-y-3">
              {[
                'React 18 + TypeScript',
                'Vite + Hot Module Replacement',
                'Tailwind CSS + shadcn/ui',
                'React Router DOM',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <svg
                  className="w-5 h-5 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
                </svg>
              </div>
              <span className="text-sm text-muted-foreground">
                Spring Boot + React Starter Kit
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with modern technologies for production-ready apps.
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
