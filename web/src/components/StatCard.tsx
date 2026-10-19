import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatCardVariant = 'default' | 'danger';

type IconTone = 'accent' | 'neutral';
type SecondaryTone = 'muted' | 'success' | 'danger';

export function StatCard({
  label,
  value,
  secondary,
  icon: Icon,
  variant = 'default',
  iconTone = 'accent',
  secondaryTone = 'muted',
  groupLabel,
}: {
  label: string;
  value: number;
  secondary?: string;
  icon: LucideIcon;
  variant?: StatCardVariant;
  iconTone?: IconTone;
  secondaryTone?: SecondaryTone;
  groupLabel?: string;
}) {
  const danger = variant === 'danger';
  const mutedIcon = !danger && iconTone === 'neutral';
  const displayValue = value.toLocaleString();

  return (
    <article
      role="group"
      aria-label={groupLabel ?? `${label}: ${displayValue}`}
      className={cn(
        'rounded-[var(--radius-stat)] border bg-card p-[var(--space-stat)]',
        'shadow-[var(--shadow-stat)]',
        'transition-[border-color,box-shadow] duration-[var(--duration-stat)] ease-[var(--ease)]',
        'hover:shadow-[var(--shadow-stat-hover)]',
        danger
          ? 'border-danger-border hover:border-danger-strong'
          : 'border-border hover:border-line-strong',
      )}
    >
      <div className="flex items-start justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-sm)] font-normal leading-[var(--leading-body)] text-text-secondary">
          {label}
        </p>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-[var(--size-stat-icon)] shrink-0 items-center justify-center rounded-[var(--radius-stat-icon)]',
            danger && 'bg-danger-soft text-danger-strong',
            mutedIcon && 'bg-neutral-soft text-text-secondary',
            !danger && !mutedIcon && 'bg-accent-soft text-stat-accent',
          )}
        >
          <Icon className="size-[var(--icon-stat)]" strokeWidth={2} />
        </span>
      </div>
      <p
        className={cn(
          'mt-[var(--space-2)] text-[length:var(--text-kpi)] font-bold leading-[var(--leading-none)] tracking-tight tabular-nums',
          danger ? 'text-danger-strong' : 'text-text-primary',
        )}
      >
        {displayValue}
      </p>
      {secondary ? (
        <p
          className={cn(
            'mt-[var(--space-3)] text-[length:var(--text-xs)] leading-[var(--leading-body)]',
            secondaryTone === 'success' && 'font-medium text-success',
            secondaryTone === 'danger' && 'font-semibold text-danger-strong',
            secondaryTone === 'muted' && 'font-normal text-text-secondary',
          )}
        >
          {secondary}
        </p>
      ) : null}
    </article>
  );
}
