'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { token, user, clearAuth } = useAuthStore();

  async function handleLogout() {
    try {
      if (token) await api.logout(token);
    } catch {
      // still clear local session
    }
    clearAuth();
    router.push('/login');
  }

  if (!token) return null;

  return (
    <header className="flex items-center justify-between gap-4 border-b bg-card px-6 py-3">
      <Link href="/dashboard" className="font-bold text-foreground">
        TaskFlow
      </Link>
      <nav className="flex items-center gap-4 text-base">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>
        <Link href="/projects" className="hover:text-primary">
          Projects
        </Link>
      </nav>
      <div className="flex items-center gap-3">
        <span className="text-base text-muted-foreground">{user?.email}</span>
        <Button type="button" variant="outline" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
