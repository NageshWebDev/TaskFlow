import { Calendar, CircleCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

function formatDay(dueDate: string) {
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function DueDate({
  dueDate,
  done = false,
  overdue = false,
}: {
  dueDate?: string | null;
  done?: boolean;
  overdue?: boolean;
}) {
  const hasDate = Boolean(dueDate) && !Number.isNaN(Date.parse(dueDate as string));
  if (done) {
    return (
      <span className="inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-xs)] font-normal tabular-nums text-text-secondary">
        <CircleCheck
          className="size-[var(--icon-due)] shrink-0 text-status-done"
          aria-hidden="true"
        />
        Done
      </span>
    );
  }

  if (!hasDate) return null;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-[var(--space-1)] text-[length:var(--text-xs)] tabular-nums',
        overdue
          ? 'font-bold text-status-overdue-text'
          : 'font-normal text-text-secondary',
      )}
    >
      <Calendar className="size-[var(--icon-due)] shrink-0" aria-hidden="true" />
      Due {formatDay(dueDate as string)}
    </span>
  );
}
