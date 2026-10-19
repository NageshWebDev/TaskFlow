'use client';

import { AuthFooterLink, AuthShell } from '@/components/AuthShell';
import { LoginForm } from '@/components/LoginForm';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking projects and tasks with TaskFlow."
      footer={
        <>
          Already have an account?{' '}
          <AuthFooterLink href="/login">Sign in</AuthFooterLink>
        </>
      }
    >
      <LoginForm mode="register" />
    </AuthShell>
  );
}
