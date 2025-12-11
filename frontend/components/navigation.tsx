"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/lib/auth-context";

export default function Navigation() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-foreground">
          MyApp
        </Link>
        <div className="flex gap-4 items-center">
          <Link
            href="/"
            className="text-foreground hover:text-primary transition"
          >
            Home
          </Link>
          {!isLoading && user ? (
            <>
              <Link
                href="/profile"
                className="text-foreground hover:text-primary transition"
              >
                Profile
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <Avatar>
                  {user.avatar_url && (
                    <AvatarImage src={user.avatar_url} alt={user.name || user.email} />
                  )}
                  <AvatarFallback>
                    {(user.name || user.email)[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-foreground">{user.name || user.email}</span>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  Logout
                </Button>
              </div>
            </>
          ) : !isLoading ? (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
