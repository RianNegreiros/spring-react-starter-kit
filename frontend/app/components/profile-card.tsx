"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserData {
  email: string;
  name: string;
  avatar_url: string;
}

export default function ProfileCard() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const normalizedData: UserData = {
            email: data.email,
            name: data.name,
            avatar_url: data.avatar_url || data.picture || "",
          };
          setUser(normalizedData);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar_url} alt={user.name} />
            <AvatarFallback>{user.email}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Email
                </label>
                <p className="text-lg text-foreground mt-1">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Name
                </label>
                <p className="text-lg text-foreground mt-1">{user.name}</p>
              </div>
              {/*<Button variant="outline" className="w-full bg-transparent">
                Edit Profile
              </Button>*/}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}