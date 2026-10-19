import type { TaskStatus } from '@/lib/types';
import { STATUS_STYLES } from '@/lib/statusTheme';
import { cn } from '@/lib/utils';

export function StatusTag({ status }: { status: TaskStatus }) {
  const tone = STATUS_STYLES[status];
  return (
    <span
      className={cn(
        'inline-flex h-7 max-w-full items-center gap-[var(--space-1)] rounded-full border',
        'px-[var(--space-2-5)]',
        'text-[length:var(--text-2xs)] font-semibold leading-none',
        tone.text,
        tone.soft,
        tone.border,
      )}
    >
      <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', tone.bar)} />
      {status}
    </span>
  );
}
