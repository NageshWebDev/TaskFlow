'use client';

import Link from 'next/link';
import { LoginForm } from '@/components/LoginForm';

export default function RegisterPage() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1>Create account</h1>
        <p className="muted">Start tracking projects with TaskFlow.</p>
        <LoginForm mode="register" />
        <p className="auth-switch">
          Already registered? <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
