'use client';

import Link from 'next/link';
import { ChevronRight, LayoutGrid, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ProjectCard({
  project,
  onRename,
  onDelete,
}: {
  project: Project;
  onRename: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  const done = Math.round((project.completionPercent / 100) * project.taskCount);
  const progressLabel =
    project.taskCount === 0
      ? 'No tasks yet'
      : `${done} of ${project.taskCount} tasks completed`;

  return (
    <article className="group relative overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface p-[var(--space-4)] shadow-[var(--shadow-task)] transition-[border-color,box-shadow] duration-[var(--duration-stat)] hover:border-line-strong hover:shadow-[var(--shadow-task-hover)]">
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-0 cursor-default rounded-[inherit] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label={`Open ${project.name}`}
      />
      <div className="relative z-10 flex items-start gap-[var(--space-3)]">
        <span
          className="flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-accent-soft text-primary"
          aria-hidden="true"
        >
          <LayoutGrid className="size-[1.125rem]" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-semibold text-text-primary">
            {project.name}
          </h2>
          <p className="mt-[var(--space-0-5)] truncate text-sm text-text-muted">
            {project.description || project.name}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={`Project actions for ${project.name}`}
            className="relative z-20 inline-flex size-[var(--control-h)] shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-text-muted outline-none hover:bg-neutral-soft hover:text-text-primary focus-visible:ring-2 focus-visible:ring-primary sm:size-8"
          >
            <MoreVertical className="size-4" aria-hidden="true" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="min-w-44 w-auto">
            <DropdownMenuItem
              className="gap-[var(--space-2)]"
              onClick={() => onRename(project)}
            >
              <Pencil className="size-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              className="gap-[var(--space-2)]"
              onClick={() => onDelete(project)}
            >
              <Trash2 className="size-4" />
              Delete project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="relative z-10 mt-[var(--space-4)]">
        <div className="mb-[var(--space-2)] flex items-center justify-between gap-[var(--space-3)] text-sm">
          <span className="text-text-muted">{progressLabel}</span>
          <span className="font-semibold tabular-nums text-text-primary">
            {project.completionPercent}%
          </span>
        </div>
        <Progress value={project.completionPercent} className="w-full" />
      </div>
      <div className="relative z-10 mt-[var(--space-3)] flex items-center justify-between gap-[var(--space-3)]">
        <p className="text-[length:var(--text-xs)] text-text-muted">Updated recently</p>
        <Link
          href={`/projects/${project.id}`}
          className="project-card-open relative z-20 inline-flex cursor-pointer items-center gap-[var(--space-1)] text-sm font-medium no-underline opacity-100 transition-opacity duration-[var(--duration-stat)] hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          Open
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
