'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { AppSelect, type SelectOption } from '@/components/ui/app-select';

export const FILTER_CONTROL_CLASS = 'filter-control';

const triggerClass = (active: boolean) =>
  cn(
    FILTER_CONTROL_CLASS,
    'h-[var(--control-h)] w-full md:h-[var(--control-h)] md:text-base',
    'rounded-[var(--radius-control)] border-border-strong bg-card text-text-primary shadow-none',
    'hover:bg-card data-placeholder:text-placeholder dark:bg-card dark:hover:bg-card',
    'focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-[var(--brand-ring)]',
    active && 'border-primary bg-accent-soft hover:bg-accent-soft',
  );

export function FilterSelect({
  value,
  onValueChange,
  items,
  'aria-label': ariaLabel,
  active = false,
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: SelectOption[];
  'aria-label'?: string;
  active?: boolean;
}) {
  const selected = items.find((item) => item.value === value);
  const announced = selected
    ? `${ariaLabel ?? 'Filter'}, ${selected.label}`
    : ariaLabel;

  return (
    <AppSelect
      value={value}
      onValueChange={onValueChange}
      items={items}
      aria-label={announced}
      active={active}
      className={triggerClass(active)}
    />
  );
}

export function FilterSearch({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  'aria-label'?: string;
}) {
  const active = value.trim().length > 0;
  return (
    <div className="relative min-w-[min(100%,var(--filter-search-min))] flex-[2_1_var(--filter-search-min)]">
      <Search
        className="pointer-events-none absolute top-1/2 left-[var(--space-3)] size-[var(--icon-sm)] -translate-y-1/2 text-placeholder"
        aria-hidden="true"
      />
      <Input
        type="search"
        placeholder={placeholder}
        aria-label={ariaLabel}
        value={value}
        data-active={active ? 'true' : undefined}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          triggerClass(active),
          'py-0 pr-[var(--space-3)] pl-[var(--search-indent)]',
        )}
      />
    </div>
  );
}
