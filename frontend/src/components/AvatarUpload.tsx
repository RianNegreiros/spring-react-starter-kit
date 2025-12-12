import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  userName: string;
}

export default function AvatarUpload({
  currentAvatarUrl,
  userName,
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshUser } = useAuth();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file type", {
        description: "Please select an image file (JPG, PNG, GIF, etc.)",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", {
        description: "File size must be less than 5MB",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/avatar`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        await refreshUser();
        toast.success("Avatar updated", {
          description: "Your profile picture has been updated successfully",
        });
      } else {
        const result = await response
          .json()
          .catch(() => ({ message: "Upload failed" }));
        toast.error("Upload failed", {
          description:
            result.message || "An error occurred while uploading your avatar",
        });
      }
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast.error("Upload failed", {
        description:
          "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!currentAvatarUrl) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/avatar`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await refreshUser();
        toast.success("Avatar removed", {
          description: "Your profile picture has been removed",
        });
      } else {
        const error = await response
          .json()
          .catch(() => ({ message: "Delete failed" }));
        toast.error("Delete failed", {
          description:
            error.message || "An error occurred while deleting your avatar",
        });
      }
    } catch (error) {
      console.error("Avatar delete error:", error);
      toast.error("Delete failed", {
        description:
          "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24">
        <AvatarImage src={currentAvatarUrl} alt="Profile" />
        <AvatarFallback className="text-2xl">
          {(userName || "U")[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="absolute -right-2 -bottom-2 flex gap-1">
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8 rounded-full"
          onClick={handleFileSelect}
          disabled={isUploading}
          aria-label="Upload avatar"
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
            aria-label="Delete avatar"
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
        aria-hidden="true"
      />
    </div>
  );
}
