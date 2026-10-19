import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AuthFooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant="link"
      className="h-auto p-0 font-semibold justify-start"
      render={<Link href={href} />}
    >
      {children}
    </Button>
  );
}

function AuthHero() {
  return (
    <div className="auth-hero">
      <Link href="/" className="auth-hero-brand">
        <span className="auth-hero-logo">T</span>
        <span className="auth-hero-name">TaskFlow</span>
      </Link>
      <div className="auth-hero-main">
        <h2 className="auth-hero-title">Get things done, together.</h2>
        <p className="auth-hero-lead">
          A simple workspace to manage projects, tasks, and progress.
        </p>
      </div>
      <div className="auth-hero-tags">
        <span className="auth-hero-tag">
          <span className="auth-hero-dot auth-hero-dot--blue" aria-hidden />
          Projects
        </span>
        <span className="auth-hero-tag">
          <span className="auth-hero-dot auth-hero-dot--violet" aria-hidden />
          Tasks
        </span>
        <span className="auth-hero-tag">
          <span className="auth-hero-dot auth-hero-dot--green" aria-hidden />
          Progress
        </span>
      </div>
    </div>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="auth-page">
      <div className="auth-panel">
        <AuthHero />
        <div className="flex flex-col justify-center bg-card px-8 py-10 md:px-10 md:py-12">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1.5 text-base text-muted-foreground">{subtitle}</p>
          {children}
          <div className="mt-5 text-base text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}
