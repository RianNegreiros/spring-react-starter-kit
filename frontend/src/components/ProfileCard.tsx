import ProfileHeader from './ProfileHeader';
import ProfileContent from './ProfileContent';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <ProfileHeader />
        <ProfileContent />
      </div>
    </main>
  );
}
