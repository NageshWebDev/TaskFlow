'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>TaskFlow</h1>
        <p className="muted">Sign in to manage your projects and tasks.</p>
        <LoginForm mode="login" />
        <p className="auth-switch">
          No account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
