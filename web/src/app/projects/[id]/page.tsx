'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Folder, Plus } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHeader } from '@/components/PageHeader';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { EmptyState } from '@/components/EmptyState';
import { RequireAuth } from '@/components/RequireAuth';
import { TaskFilters, TaskFilterValues } from '@/components/TaskFilters';
import { ProjectTaskCard } from '@/components/ProjectTaskCard';
import { TaskFormDialog, type TaskFormValues } from '@/components/TaskFormDialog';
import { api } from '@/lib/api';
import type { Project, Task } from '@/lib/types';
import {
  filterTasks,
  parseTaskFilters,
  serializeTaskFilters,
  type TaskBoardFilters,
} from '@/lib/taskFilters';
import { startOfLocalDay } from '@/lib/overdue';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

function toDateInput(iso: string) {
  const due = startOfLocalDay(new Date(iso));
  if (Number.isNaN(due.getTime())) return '';
  const year = due.getFullYear();
  const month = String(due.getMonth() + 1).padStart(2, '0');
  const day = String(due.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function valuesFromTask(task: Task): TaskFormValues {
  return {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: toDateInput(task.dueDate),
  };
}

function ProjectDetailContent() {
  const params = useParams();
  const projectId = params.id as string;
  const token = useAuthStore((s) => s.token)!;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const boardFilters = useMemo(
    () => parseTaskFilters(searchParams),
    [searchParams],
  );
  const filters: TaskFilterValues = {
    status: boardFilters.status === 'all' ? '' : boardFilters.status,
    priority: boardFilters.priority === 'all' ? '' : boardFilters.priority,
    search: boardFilters.q,
  };

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([
        api.getProject(token, projectId),
        api.listTasks(token, projectId),
      ]);
      setProject(p);
      setTasks(t);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
  }, [token, projectId]);

  useEffect(() => {
    void load();
  }, [load]);

  const setFilters = useCallback(
    (next: TaskFilterValues) => {
      const query = serializeTaskFilters({
        project: 'all',
        status: (next.status || 'all') as TaskBoardFilters['status'],
        priority: (next.priority || 'all') as TaskBoardFilters['priority'],
        q: next.search,
      });
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const visible = useMemo(
    () =>
      filterTasks(tasks, {
        project: 'all',
        status: filters.status || 'all',
        priority: filters.priority || 'all',
        q: filters.search,
      }),
    [tasks, filters],
  );

  function openCreate() {
    setEditing(null);
    setFormError('');
    setFormOpen(true);
  }

  function openEdit(task: Task) {
    setEditing(task);
    setFormError('');
    setFormOpen(true);
  }

  async function onSave(values: TaskFormValues) {
    setFormError('');
    const dueMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(values.dueDate);
    if (!dueMatch) {
      setFormError('Due date is required');
      return;
    }
    const dueDate = new Date(
      Number(dueMatch[1]),
      Number(dueMatch[2]) - 1,
      Number(dueMatch[3]),
    ).toISOString();
    const payload = {
      title: values.title.trim(),
      description: values.description,
      status: values.status,
      priority: values.priority,
      dueDate,
    };
    try {
      if (editing) {
        await api.updateTask(token, projectId, editing.id, payload);
      } else {
        await api.createTask(token, projectId, payload);
      }
      setFormOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Save failed');
    }
  }

  async function onDelete() {
    if (!deleteId) return;
    await api.deleteTask(token, projectId, deleteId);
    setDeleteId(null);
    await load();
  }

  const filtering = Boolean(filters.status || filters.priority || filters.search.trim());

  const subtitle = useMemo(() => {
    if (!project) return undefined;
    const description = project.description.trim();
    if (description && description !== project.name) return description;
    const today = startOfLocalDay(new Date());
    const weekday = today.getDay();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (weekday === 0 ? 0 : 7 - weekday));
    const dueThisWeek = tasks.filter((task) => {
      if (task.status === 'Done') return false;
      const due = startOfLocalDay(new Date(task.dueDate));
      return due.getTime() >= today.getTime() && due.getTime() <= endOfWeek.getTime();
    }).length;
    const count = tasks.length;
    return `${count} ${count === 1 ? 'task' : 'tasks'} · ${dueThisWeek} due this week`;
  }, [project, tasks]);

  return (
    <AppShell>
      <Breadcrumbs
        items={[
          { label: 'Projects', href: '/projects', icon: Folder },
          { label: project?.name || 'Project' },
        ]}
      />
      <PageHeader
        title={project?.name || 'Project'}
        subtitle={subtitle}
        action={
          <Button
            className="h-[var(--control-h)] min-w-0 rounded-[var(--radius-control)]"
            onClick={openCreate}
          >
            <Plus data-icon="inline-start" />
            Add task
          </Button>
        }
      />
      <div className="space-y-[var(--space-4)]">
        {error ? <p className="text-base text-destructive">{error}</p> : null}

        {project ? (
          <div className="flex flex-wrap gap-[var(--space-2)]">
            <span className="inline-flex items-center rounded-full bg-neutral-soft px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium text-text-secondary">
              {project.taskCount} {project.taskCount === 1 ? 'task' : 'tasks'}
            </span>
            <span className="inline-flex items-center rounded-full bg-neutral-soft px-[var(--space-3)] py-[var(--space-1)] text-[length:var(--text-xs)] font-medium tabular-nums text-text-secondary">
              {project.completionPercent}% complete
            </span>
          </div>
        ) : null}

        <TaskFormDialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) {
              setEditing(null);
              setFormError('');
            }
          }}
          mode={editing ? 'edit' : 'create'}
          error={formError}
          initial={editing ? valuesFromTask(editing) : undefined}
          onSubmit={onSave}
        />

        <ConfirmDialog
          open={Boolean(deleteId)}
          onOpenChange={(open) => {
            if (!open) setDeleteId(null);
          }}
          title="Delete task?"
          description="This task will be permanently removed."
          onConfirm={onDelete}
        />

        <TaskFilters value={filters} onChange={setFilters} />

        {visible.length === 0 ? (
          <EmptyState
            title={filtering ? 'No matching tasks' : 'No tasks yet'}
            message={
              filtering
                ? 'Try changing or removing a filter.'
                : 'Create a new task with Add task.'
            }
          />
        ) : (
          <div className="grid gap-[var(--space-2-5)]">
            {visible.map((task) => (
              <ProjectTaskCard
                key={task.id}
                task={task}
                onEdit={() => openEdit(task)}
                onDelete={() => setDeleteId(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ProjectDetailPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<p className="text-base text-muted-foreground">Loading project…</p>}>
        <ProjectDetailContent />
      </Suspense>
    </RequireAuth>
  );
}
