import type { TaskPriority, TaskStatus } from '@/lib/types';

export const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'To Do', label: 'To Do' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Done', label: 'Done' },
];

export const PRIORITY_OPTIONS: { value: TaskPriority; label: string }[] = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const ALL_STATUS = [
  { value: 'all', label: 'All statuses' },
  ...STATUS_OPTIONS,
];

export const ALL_STATUS_WITH_OVERDUE = [
  ...ALL_STATUS,
  { value: 'overdue', label: 'Overdue' },
];

export const ALL_PRIORITY = [
  { value: 'all', label: 'All priorities' },
  ...PRIORITY_OPTIONS,
];

export const TASK_PRIORITY_FILTER = [
  { value: 'all', label: 'All priorities' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];
