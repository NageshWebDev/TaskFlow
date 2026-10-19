'use client';

import { cn } from '@/lib/utils';

export function StatusChip({
  label,
  count,
  selected,
  onClick,
  dotClass,
  danger = false,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
  dotClass: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex min-h-[var(--control-h)] items-center gap-[var(--space-2)] rounded-full',
        'border px-[var(--space-4)] text-sm font-medium',
        'outline-none transition-[border-color,box-shadow,background-color] duration-[var(--duration-stat)]',
        'focus-visible:ring-3 focus-visible:ring-primary/40',
        selected
          ? 'border-primary bg-card text-text-primary shadow-[var(--shadow-task)]'
          : 'border-border bg-card text-text-secondary hover:border-line-strong',
        danger && !selected && 'border-status-overdue-border text-status-overdue',
      )}
    >
      <span aria-hidden="true" className={cn('size-2 shrink-0 rounded-full', dotClass)} />
      <span>{label}</span>
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
