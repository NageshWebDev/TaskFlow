'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LayoutGrid,
  Folder,
  List,
  LogOut,
  ChevronDown,
  Moon,
  type LucideIcon,
} from 'lucide-react';
import { api } from '@/lib/api';
import { applyTheme, getStoredTheme, type Theme } from '@/lib/theme';
import { useAuthStore } from '@/store/authStore';
import { displayName } from '@/lib/displayName';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const nav: { href: string; label: string; icon: LucideIcon }[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/projects', label: 'Projects', icon: Folder },
  { href: '/tasks', label: 'Tasks', icon: List },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, user, clearAuth } = useAuthStore();
  const initial = (user?.email?.[0] || 'U').toUpperCase();
  const [theme, setTheme] = useState<Theme>('light');
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    setTheme(getStoredTheme());
  }, []);

  async function handleLogout() {
    try {
      if (token) await api.logout(token);
    } catch {
      /* ignore */
    }
    clearAuth();
    router.push('/login');
  }

  function setDarkMode(on: boolean) {
    const next: Theme = on ? 'dark' : 'light';
    applyTheme(next);
    setTheme(next);
  }

  return (
    <div className="grid min-h-svh bg-background md:grid-cols-[15.5rem_1fr]">
      <aside className="flex flex-col bg-sidebar px-[var(--space-4)] py-[var(--space-5)] text-sidebar-foreground md:sticky md:top-0 md:h-svh md:overflow-y-auto">
        <Link
          href="/dashboard"
          className="mb-[var(--space-8)] flex items-center gap-[var(--space-3)] px-[var(--space-2)] text-sidebar-foreground"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-foreground">
            <List className="size-5" strokeWidth={2.25} aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight">TaskFlow</span>
        </Link>
        <p className="mb-[var(--space-3)] px-[var(--space-3)] text-[length:var(--text-xs)] font-semibold tracking-[0.14em] text-sidebar-muted">
          WORKSPACE
        </p>
        <nav className="grid gap-[var(--space-1)]">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-[var(--space-3)] rounded-[var(--radius-lg)] px-[var(--space-4)] py-[var(--space-3)] text-base transition-colors',
                  'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40',
                  active
                    ? 'bg-sidebar-active font-semibold text-sidebar-foreground'
                    : 'text-sidebar-muted hover:bg-sidebar-hover hover:text-sidebar-foreground',
                )}
              >
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-[var(--space-2)] left-0 w-1 rounded-full bg-primary"
                  />
                ) : null}
                <Icon className="size-[1.125rem] shrink-0" strokeWidth={active ? 2.25 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <DropdownMenu open={accountOpen} onOpenChange={setAccountOpen}>
          <DropdownMenuTrigger
            aria-label="Account menu"
            className={cn(
              'mt-auto flex h-12 w-full min-w-0 items-center gap-[var(--space-3)] rounded-[var(--radius-xl)]',
              'border border-sidebar-line bg-sidebar-elevated px-[var(--space-3)] text-left',
              'outline-none transition-colors hover:bg-sidebar-soft',
              'focus-visible:ring-3 focus-visible:ring-primary/40',
            )}
          >
            <Avatar className="size-8 bg-primary-foreground after:hidden">
              <AvatarFallback className="bg-primary-foreground text-sm font-semibold text-primary">
                {initial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {displayName(user?.email)}
              </p>
              <p className="truncate text-[length:var(--text-xs)] text-sidebar-muted">
                Workspace owner
              </p>
            </div>
            <ChevronDown
              className={cn(
                'size-4 shrink-0 text-sidebar-muted transition-transform duration-[var(--duration-stat)]',
                accountOpen && 'rotate-180',
              )}
              aria-hidden="true"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={10}
            className="min-w-(--anchor-width) rounded-[var(--radius-xl)] border border-sidebar-line bg-sidebar-elevated p-[var(--space-2)] text-sidebar-foreground shadow-lg ring-0"
          >
            <div
              className="flex cursor-pointer items-center gap-[var(--space-3)] rounded-[var(--radius-md)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-sidebar-foreground hover:bg-sidebar-hover"
              onClick={() => setDarkMode(theme !== 'dark')}
            >
              <Moon className="size-4 shrink-0 text-sidebar-muted" aria-hidden="true" />
              <span className="flex-1">Dark mode</span>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={setDarkMode}
                label="Dark mode"
              />
            </div>
            <DropdownMenuItem
              variant="destructive"
              className="gap-[var(--space-3)] px-[var(--space-3)] py-[var(--space-2)] text-sm text-destructive focus:bg-sidebar-hover"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      <div className="min-h-0 min-w-0">
        <div className="mx-auto w-full max-w-[1200px] px-8 py-6">{children}</div>
      </div>
    </div>
  );
}
