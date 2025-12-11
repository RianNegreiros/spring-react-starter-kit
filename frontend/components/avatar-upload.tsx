"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
}

export default function AvatarUpload({ currentAvatarUrl, userName }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshUser } = useAuth();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/avatar', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        await refreshUser();
      } else {
        const result = await response.json();
        alert(result.message || 'Upload failed');
      }
    } catch (error) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;

    setIsDeleting(true);
    try {
      const response = await fetch('/api/avatar', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await refreshUser();
      } else {
        const error = await response.json();
        alert(error.message || 'Delete failed');
      }
    } catch (error) {
      alert('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl} alt="Profile" />
        <AvatarFallback className="text-2xl">
          {(userName || 'U')[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="absolute -right-2 -bottom-2 flex gap-1">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={handleFileSelect}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </Button>
        
        {currentAvatarUrl && (
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
