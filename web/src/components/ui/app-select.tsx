'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type SelectOption = { value: string; label: string; dotClass?: string };

export function AppSelect({
  value,
  onValueChange,
  items,
  placeholder = 'Select…',
  'aria-label': ariaLabel,
  className,
  active,
}: {
  value: string;
  onValueChange: (value: string) => void;
  items: SelectOption[];
  placeholder?: string;
  'aria-label'?: string;
  className?: string;
  active?: boolean;
}) {
  return (
    <Select
      value={value || null}
      items={items}
      itemToStringLabel={(next) =>
        items.find((item) => item.value === String(next))?.label ?? String(next ?? '')
      }
      onValueChange={(next) => {
        if (next == null) return;
        onValueChange(String(next));
      }}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        data-active={active ? 'true' : undefined}
        className={cn(
          'h-10 w-full min-w-0 rounded-xl border-border bg-muted px-3 text-foreground shadow-none hover:bg-secondary',
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent
        align="start"
        alignItemWithTrigger={false}
        className="min-w-[var(--anchor-width)] w-max p-1"
      >
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.dotClass ? (
              <span className="inline-flex items-center gap-[var(--space-2)]">
                <span
                  aria-hidden="true"
                  className={cn('size-2 shrink-0 rounded-full', item.dotClass)}
                />
                {item.label}
              </span>
            ) : (
              item.label
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
