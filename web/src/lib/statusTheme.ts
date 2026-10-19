import type { TaskPriority, TaskStatus } from './types';

export const STATUS_CSS: Record<TaskStatus, string> = {
  'To Do': 'var(--status-todo)',
  'In Progress': 'var(--status-progress)',
  Done: 'var(--status-done)',
};

export const OVERDUE_CSS = 'var(--status-overdue)';

export const STATUS_STYLES: Record<
  TaskStatus,
  { text: string; soft: string; border: string; bar: string }
> = {
  'To Do': {
    text: 'text-status-todo',
    soft: 'bg-status-todo-soft',
    border: 'border-status-todo-border',
    bar: 'bg-status-todo',
  },
  'In Progress': {
    text: 'text-status-progress',
    soft: 'bg-status-progress-soft',
    border: 'border-status-progress-border',
    bar: 'bg-status-progress',
  },
  Done: {
    text: 'text-status-done',
    soft: 'bg-status-done-soft',
    border: 'border-status-done-border',
    bar: 'bg-status-done',
  },
};

export const PRIORITY_STYLES: Record<TaskPriority, { text: string; soft: string }> = {
  Low: { text: 'text-priority-low', soft: 'bg-priority-low-soft' },
  Medium: { text: 'text-priority-medium', soft: 'bg-priority-medium-soft' },
  High: { text: 'text-priority-high', soft: 'bg-priority-high-soft' },
};

export const PRIORITY_FLAG: Record<TaskPriority, string> = {
  Low: 'text-priority-low',
  Medium: 'text-priority-medium',
  High: 'text-priority-high',
};

export const LANE_EMPTY: Record<TaskStatus, { title: string; message: string }> = {
  'To Do': {
    title: 'No tasks to do',
    message: 'Create one with New task.',
  },
  'In Progress': {
    title: 'Nothing in progress right now.',
    message: '',
  },
  Done: {
    title: 'Nothing completed yet',
    message: 'Finished tasks will show up here.',
  },
};
