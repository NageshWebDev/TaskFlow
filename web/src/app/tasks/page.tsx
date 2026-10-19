'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Plus } from 'lucide-react';
import { AppShell } from '@/components/AppShell';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState } from '@/components/EmptyState';
import { RequireAuth } from '@/components/RequireAuth';
import { BoardLane } from '@/components/BoardLane';
import { TaskCard } from '@/components/TaskCard';
import { FilterSearch, FilterSelect } from '@/components/FilterControl';
import { api } from '@/lib/api';
import type { Project, Task, TaskPriority, TaskStatus } from '@/lib/types';
import { ALL_STATUS_WITH_OVERDUE, TASK_PRIORITY_FILTER } from '@/lib/taskOptions';
import { sortLaneTasks } from '@/lib/overdue';
import {
  SEARCH_DEBOUNCE_MS,
  filterTasks,
  filtersAreActive,
  parseTaskFilters,
  serializeTaskFilters,
  type BoardStatusFilter,
  type TaskBoardFilters,
} from '@/lib/taskFilters';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

const LANES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];

const STATUS_FILTER_ITEMS = ALL_STATUS_WITH_OVERDUE.map((item) => {
  if (item.value === 'all') return item;
  const dots: Record<string, string> = {
    'To Do': 'bg-status-todo',
    'In Progress': 'bg-status-progress',
    Done: 'bg-status-done',
    overdue: 'bg-status-overdue',
  };
  return { ...item, dotClass: dots[item.value] };
});

function TasksContent() {
  const token = useAuthStore((s) => s.token)!;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseTaskFilters(searchParams),
    [searchParams],
  );

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchDraft, setSearchDraft] = useState(filters.q);
  const [error, setError] = useState('');

  useEffect(() => {
    setSearchDraft(filters.q);
  }, [filters.q]);

  const writeFilters = useCallback(
    (next: TaskBoardFilters) => {
      const query = serializeTaskFilters(next);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchDraft === filters.q) return;
      writeFilters({ ...filters, q: searchDraft });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [searchDraft, filters, writeFilters]);

  const load = useCallback(async () => {
    try {
      const [p, t] = await Promise.all([
        api.listProjects(token),
        api.listAllTasks(token),
      ]);
      setProjects(p);
      setTasks(t);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  const visible = useMemo(() => filterTasks(tasks, filters), [tasks, filters]);

  const grouped = useMemo(() => {
    const map: Record<TaskStatus, Task[]> = {
      'To Do': [],
      'In Progress': [],
      Done: [],
    };
    for (const task of visible) map[task.status].push(task);
    for (const lane of LANES) map[lane] = sortLaneTasks(map[lane]);
    return map;
  }, [visible]);

  const filtering = filtersAreActive(filters);
  const singleStatus: TaskStatus | null =
    filters.status !== 'all' && filters.status !== 'overdue' ? filters.status : null;
  const lanes = singleStatus ? [singleStatus] : LANES;
  const showGlobalEmpty = visible.length === 0 && filtering;

  return (
    <AppShell>
      <PageHeader
        title="Tasks"
        subtitle="Organize tasks and monitor delivery."
        action={
          <Button
            className="h-[var(--control-h)] min-w-0 rounded-[var(--radius-control)]"
            render={<Link href="/projects" />}
          >
            <Plus data-icon="inline-start" />
            New task
          </Button>
        }
      />
      <div className="space-y-[var(--space-4)]">
        {error ? <p className="text-base text-destructive">{error}</p> : null}

        <div className="flex flex-wrap items-stretch gap-[var(--space-3)]">
          <FilterSearch
            placeholder="Search tasks..."
            aria-label="Search tasks by title or project"
            value={searchDraft}
            onChange={setSearchDraft}
          />
          <div className="w-full sm:w-[var(--filter-select-w)] sm:shrink-0">
            <FilterSelect
              aria-label="Filter by project"
              value={filters.project}
              onValueChange={(next) => writeFilters({ ...filters, project: next })}
              items={[
                { value: 'all', label: 'All projects' },
                ...projects.map((p) => ({ value: p.id, label: p.name })),
              ]}
              active={filters.project !== 'all'}
            />
          </div>
          <div className="w-full sm:w-[var(--filter-select-w)] sm:shrink-0">
            <FilterSelect
              aria-label="Filter by status"
              value={filters.status}
              onValueChange={(next) =>
                writeFilters({ ...filters, status: next as BoardStatusFilter })
              }
              items={STATUS_FILTER_ITEMS}
              active={filters.status !== 'all'}
            />
          </div>
          <div className="w-full sm:w-[var(--filter-select-w)] sm:shrink-0">
            <FilterSelect
              aria-label="Filter by priority"
              value={filters.priority}
              onValueChange={(next) =>
                writeFilters({
                  ...filters,
                  priority: next as TaskPriority | 'all',
                })
              }
              items={TASK_PRIORITY_FILTER}
              active={filters.priority !== 'all'}
            />
          </div>
        </div>

        {showGlobalEmpty ? (
          <EmptyState
            title="No tasks match your filters"
            message="Try changing or removing a filter."
          />
        ) : (
          <div
            className={
              lanes.length === 1
                ? 'grid grid-cols-1 gap-[var(--space-4)]'
                : 'grid gap-[var(--space-4)] md:grid-cols-3'
            }
          >
            {lanes.map((lane) => (
              <BoardLane
                key={lane}
                status={lane}
                count={grouped[lane].length}
                filtered={filtering}
              >
                {grouped[lane].map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </BoardLane>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function TasksPage() {
  return (
    <RequireAuth>
      <Suspense fallback={<p className="text-base text-muted-foreground">Loading tasks…</p>}>
        <TasksContent />
      </Suspense>
    </RequireAuth>
  );
}
