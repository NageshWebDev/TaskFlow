'use client';

import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { Task } from '@/lib/types';
import { isOverdue } from '@/lib/overdue';
import { cn } from '@/lib/utils';
import { StatusTag } from '@/components/StatusTag';
import { PriorityTag } from '@/components/PriorityTag';
import { DueDate } from '@/components/DueDate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProjectTaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const overdue = isOverdue(task);
  const done = task.status === 'Done';

  return (
    <article className="task-card">
      <div className="flex items-start gap-[var(--space-3)]">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              'line-clamp-2 text-base font-semibold leading-[var(--leading-title)] text-text-primary break-words',
              done && 'text-text-muted line-through',
            )}
          >
            {task.title}
          </h3>
          {task.description ? (
            <p className="mt-[var(--space-1)] line-clamp-2 text-sm leading-5 text-text-muted">
              {task.description}
            </p>
          ) : null}
          <div className="mt-[var(--space-2-5)] flex min-w-0 flex-wrap items-center gap-[var(--space-2)]">
            <DueDate dueDate={task.dueDate} done={done} overdue={overdue} />
            {overdue ? (
              <span className="inline-flex items-center rounded-[var(--radius-tag)] border border-status-overdue-border bg-status-overdue-soft px-[var(--tag-px)] py-[var(--tag-py)] text-[length:var(--text-2xs)] font-semibold text-status-overdue-text">
                Overdue
              </span>
            ) : null}
          </div>
        </div>
        <div className="flex h-7 shrink-0 items-center gap-[var(--space-2)]">
          <StatusTag status={task.status} />
          <span className="inline-flex size-7 items-center justify-center">
            <PriorityTag priority={task.priority} />
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Task actions for ${task.title}`}
              className="inline-flex size-7 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-text-muted outline-none hover:bg-neutral-soft hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary"
            >
              <MoreVertical className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40 w-auto">
              <DropdownMenuItem className="gap-[var(--space-2)]" onClick={onEdit}>
                <Pencil className="size-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="gap-[var(--space-2)]"
                onClick={onDelete}
              >
                <Trash2 className="size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </article>
  );
}
