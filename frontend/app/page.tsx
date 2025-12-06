import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-foreground text-balance">Welcome to MyApp</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            This is a simple multi-page application with a homepage, login page, and profile page.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/login">
              <Button size="lg">Get Started</Button>
            </Link>
          </div>
        </div>

      </div>
    </main>
  )
}
