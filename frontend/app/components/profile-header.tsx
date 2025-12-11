"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import AvatarUpload from "@/components/avatar-upload";

export default function ProfileHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          <AvatarUpload
            currentAvatarUrl={user.avatar_url}
            userName={user.name}
          />
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{user.name}</h1>
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
