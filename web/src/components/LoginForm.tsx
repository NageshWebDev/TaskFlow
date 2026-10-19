'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';

interface LoginFormProps {
  mode?: 'login' | 'register';
}

export function LoginForm({ mode = 'login' }: LoginFormProps) {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result =
        mode === 'register'
          ? await api.register(email, password)
          : await api.login(email, password);
      setAuth(result.token, result.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const submitLabel =
    loading
      ? 'Please wait…'
      : mode === 'register'
        ? 'Create account'
        : 'Sign in';

  return (
    <form className="mt-7" onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="alex@example.com"
            className="h-11 border-border bg-card px-3"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            placeholder="••••••••••••"
            className="h-11 border-border bg-card px-3"
          />
        </Field>
        {error ? <FieldError>{error}</FieldError> : null}
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full min-w-0 font-semibold"
        >
          {submitLabel}
        </Button>
      </FieldGroup>
    </form>
  );
}
