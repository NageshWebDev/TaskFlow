'use client';

import { cn } from '@/lib/utils';

export function Switch({
  checked,
  onCheckedChange,
  label,
  className,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onCheckedChange(!checked);
      }}
      className={cn(
        'relative inline-flex h-[var(--switch-height)] w-[var(--switch-width)] shrink-0 items-center rounded-full',
        'outline-none transition-colors duration-[var(--duration-stat)]',
        'focus-visible:ring-3 focus-visible:ring-primary/40',
        checked ? 'bg-primary' : 'bg-switch-track',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none block size-[var(--switch-knob)] rounded-full bg-switch-thumb shadow-sm',
          'transition-transform duration-[var(--duration-stat)]',
          checked ? 'translate-x-[calc(var(--switch-width)-var(--switch-knob)-0.125rem)]' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}
