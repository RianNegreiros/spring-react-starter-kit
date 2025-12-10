import ProfileCard from "../components/profile-card";
import { ProtectedRoute } from "@/components/protected-route";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileCard />
    </ProtectedRoute>
  );
}
