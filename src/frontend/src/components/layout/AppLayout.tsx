import { Outlet } from '@tanstack/react-router';
import { Header } from '../nav/Header';
import { Footer } from './Footer';
import { ProfileSetupDialog } from '../auth/ProfileSetupDialog';
import { Toaster } from '@/components/ui/sonner';

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ProfileSetupDialog />
      <Toaster />
    </div>
  );
}
