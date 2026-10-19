'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
    if (!useAuthStore.getState().token) {
      router.replace('/login');
    }
  }, [router, token]);

  if (!ready || !token) {
    return (
      <p className="px-4 py-12 text-center text-base text-muted-foreground">
        Loading…
      </p>
    );
  }

  return <>{children}</>;
}
