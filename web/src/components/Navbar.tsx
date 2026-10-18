'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

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
    <header className="navbar">
      <Link href="/dashboard" className="brand">
        TaskFlow
      </Link>
      <nav className="nav-links">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/projects">Projects</Link>
      </nav>
      <div className="nav-user">
        <span className="muted">{user?.email}</span>
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
