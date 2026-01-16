import ProfileCard from '../components/ProfileCard';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileCard />
    </ProtectedRoute>
  );
}
