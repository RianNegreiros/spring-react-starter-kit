import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          <h1 className="text-5xl font-bold text-foreground text-balance">
            Spring Boot + React Starter Kit
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
            A full-stack web application starter kit combining Spring Boot
            backend with React frontend, featuring JWT + Oauth2 authentication,
            PostgreSQL database, and Docker containerization.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-16">
            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Backend Stack</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Spring Boot 4 + Java 21</li>
                <li>• Spring Security + JWT + Oauth2</li>
                <li>• PostgreSQL + Flyway</li>
                <li>• Maven + Lombok</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Frontend Stack</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Next.js 16 + TypeScript</li>
                <li>• Tailwind CSS + Shadcn/ui</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-12">
            <Link to="/register">
              <Button size="lg">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
