import type { Task, TaskPriority, TaskStatus } from './types';
import { isOverdue } from './overdue';

export type BoardStatusFilter = 'all' | TaskStatus | 'overdue';

export type TaskBoardFilters = {
  project: string;
  status: BoardStatusFilter;
  priority: TaskPriority | 'all';
  q: string;
};

export const SEARCH_DEBOUNCE_MS = 250;

const STATUS_SLUG: Record<Exclude<BoardStatusFilter, 'all'>, string> = {
  'To Do': 'todo',
  'In Progress': 'in-progress',
  Done: 'done',
  overdue: 'overdue',
};

const STATUS_FROM_SLUG: Record<string, Exclude<BoardStatusFilter, 'all'>> = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
  overdue: 'overdue',
};

const PRIORITY_FROM_SLUG: Record<string, TaskPriority> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const DEFAULT_TASK_FILTERS: TaskBoardFilters = {
  project: 'all',
  status: 'all',
  priority: 'all',
  q: '',
};

export function parseTaskFilters(params: URLSearchParams): TaskBoardFilters {
  const project = params.get('project')?.trim() || 'all';
  const statusSlug = params.get('status')?.trim().toLowerCase() ?? '';
  const status = STATUS_FROM_SLUG[statusSlug] ?? 'all';
  const prioritySlug = params.get('priority')?.trim().toLowerCase() ?? '';
  const priority = PRIORITY_FROM_SLUG[prioritySlug] ?? 'all';
  const q = params.get('q') ?? '';
  return { project, status, priority, q };
}

export function projectTaskHref(task: Pick<Task, 'projectId' | 'title' | 'status' | 'priority'>): string {
  const query = serializeTaskFilters({
    project: 'all',
    status: task.status,
    priority: task.priority,
    q: task.title,
  });
  return query ? `/projects/${task.projectId}?${query}` : `/projects/${task.projectId}`;
}

export function serializeTaskFilters(filters: TaskBoardFilters): string {
  const params = new URLSearchParams();
  if (filters.project !== 'all') params.set('project', filters.project);
  if (filters.status !== 'all') params.set('status', STATUS_SLUG[filters.status]);
  if (filters.priority !== 'all') params.set('priority', filters.priority.toLowerCase());
  if (filters.q.trim()) params.set('q', filters.q.trim());
  return params.toString();
}

export function filtersAreActive(filters: TaskBoardFilters): boolean {
  return (
    filters.project !== 'all' ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.q.trim() !== ''
  );
}

export function filterTasks(tasks: Task[], filters: TaskBoardFilters): Task[] {
  const query = filters.q.trim().toLowerCase();
  return tasks.filter((task) => {
    if (filters.project !== 'all' && task.projectId !== filters.project) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.status === 'overdue') {
      if (!isOverdue(task)) return false;
    } else if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }
    if (query) {
      const title = task.title.toLowerCase();
      const projectName = (task.projectName || '').toLowerCase();
      if (!title.includes(query) && !projectName.includes(query)) return false;
    }
    return true;
  });
}
