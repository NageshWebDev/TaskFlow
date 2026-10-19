import type { ReactNode } from 'react';
import type { TaskStatus } from '@/lib/types';
import { LANE_EMPTY, STATUS_STYLES } from '@/lib/statusTheme';
import { cn } from '@/lib/utils';
import { CircleCheck, ListTodo, LoaderCircle } from 'lucide-react';

const laneIcons = {
  'To Do': ListTodo,
  'In Progress': LoaderCircle,
  Done: CircleCheck,
} as const;

export function BoardLane({
  status,
  count,
  children,
  filtered = false,
}: {
  status: TaskStatus;
  count: number;
  children: ReactNode;
  filtered?: boolean;
}) {
  const tone = STATUS_STYLES[status];
  const empty = filtered
    ? { title: 'No matching tasks', message: '' }
    : LANE_EMPTY[status];
  const Icon = laneIcons[status];
  const isEmpty = count === 0;

  return (
    <section
      aria-label={`${status}: ${count}`}
      className="flex min-h-[var(--lane-min)] flex-col overflow-hidden rounded-[var(--radius-lane)] border border-border bg-lane-bg p-[var(--space-lane)] shadow-[var(--shadow-lane)]"
    >
      <div
        aria-hidden="true"
        className={cn('-mx-[var(--space-lane)] -mt-[var(--space-lane)] mb-[var(--space-3)] h-[var(--lane-bar)]', tone.bar)}
      />
      <header className="mb-[var(--space-3)] flex items-center gap-[var(--space-2)]">
        <span aria-hidden="true" className={cn('size-2 rounded-full', tone.bar)} />
        <h2 className="text-sm font-semibold text-text-primary">{status}</h2>
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-card px-[var(--space-2)] text-[length:var(--text-xs)] font-semibold text-text-secondary">
          {count}
        </span>
      </header>
      <div className="flex flex-1 flex-col gap-[var(--space-2-5)]">
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-[var(--radius-task)] border border-dashed border-border px-[var(--space-4)] py-[var(--space-8)] text-center">
            {filtered ? null : (
              <Icon
                className="mb-[var(--space-2)] size-6 text-text-secondary"
                aria-hidden="true"
              />
            )}
            <p className="text-sm font-medium text-text-primary">{empty.title}</p>
            {empty.message ? (
              <p className="mt-[var(--space-1)] text-[length:var(--text-xs)] text-text-secondary">
                {empty.message}
              </p>
            ) : null}
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
