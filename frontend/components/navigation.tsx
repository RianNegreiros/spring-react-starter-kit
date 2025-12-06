"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface UserData {
  email: string;
  name: string;
  avatar_url: string;
}

export default function Navigation() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    let mounted = true;
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        });

        if (!mounted) return;

        if (response.ok) {
          const data = await response.json();
          setIsLoggedIn(true);
          const normalizedData: UserData = {
            email: data.email,
            name: data.name,
            avatar_url: data.avatar_url || data.picture || "",
          };
          setUser(normalizedData);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    checkAuth();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setIsLoggedIn(false);
        setUser(null);
        router.push("/");
      }
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
          {isLoggedIn && user ? (
            <>
              <Link
                href="/profile"
                className="text-foreground hover:text-primary transition"
              >
                Profile
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <Avatar>
                  <AvatarImage src={user.avatar_url} alt={user.name} />
                  <AvatarFallback>{user.email}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={handleLogout} size="sm">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <Link href="/login">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
