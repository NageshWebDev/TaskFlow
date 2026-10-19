'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Task } from '@/lib/types';
import { isOverdue } from '@/lib/overdue';
import { projectTaskHref } from '@/lib/taskFilters';
import { cn } from '@/lib/utils';
import { PriorityTag } from '@/components/PriorityTag';
import { DueDate } from '@/components/DueDate';

export function TaskCard({ task }: { task: Task }) {
  const overdue = isOverdue(task);
  const done = task.status === 'Done';
  const href = projectTaskHref(task);

  return (
    <article className="task-card group">
      <div className="flex items-stretch gap-[var(--space-3)]">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              'line-clamp-2 text-base font-semibold leading-[var(--leading-title)] text-text-primary break-words',
              done && 'text-text-muted line-through',
            )}
          >
            {task.title}
          </h3>
          <p className="mt-[var(--space-1)] truncate text-sm leading-5 text-text-muted">
            {task.projectName || 'Project'}
          </p>
          <div className="mt-[var(--space-2-5)] flex min-w-0 flex-wrap items-center gap-[var(--space-2)]">
            <DueDate dueDate={task.dueDate} done={done} overdue={overdue} />
            {overdue ? (
              <span className="inline-flex items-center rounded-[var(--radius-tag)] border border-status-overdue-border bg-status-overdue-soft px-[var(--tag-px)] py-[var(--tag-py)] text-[length:var(--text-2xs)] font-semibold text-status-overdue-text">
                Overdue
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end justify-between self-stretch">
          <span className="inline-flex size-7 items-center justify-center">
            <PriorityTag priority={task.priority} />
          </span>
          <Link
            href={href}
            aria-label={`Open ${task.title}`}
            className={cn(
              'project-card-open inline-flex cursor-pointer items-center gap-[var(--space-1)]',
              'text-sm font-medium leading-none no-underline',
              'opacity-100 transition-opacity duration-[var(--duration-stat)]',
              'hover:underline',
              'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none',
              'sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100',
            )}
          >
            Open
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
