'use client';

import { AuthFooterLink, AuthShell } from '@/components/AuthShell';
import { LoginForm } from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your TaskFlow account"
      footer={
        <>
          Don&apos;t have an account?{' '}
          <AuthFooterLink href="/register">Create account</AuthFooterLink>
        </>
      }
    >
      <LoginForm mode="login" />
    </AuthShell>
  );
}
