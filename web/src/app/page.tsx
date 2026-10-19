'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function HomePage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    router.replace(token ? '/dashboard' : '/login');
  }, [router, token]);

  return (
    <p className="p-8 text-center text-base text-muted-foreground">Redirecting…</p>
  );
}
