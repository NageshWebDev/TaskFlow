'use client';

import type { TaskPriority, TaskStatus } from '@/lib/types';

export interface TaskFilterValues {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  search: string;
}

interface TaskFiltersProps {
  value: TaskFilterValues;
  onChange: (next: TaskFilterValues) => void;
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div className="filters" data-testid="task-filters">
      <input
        type="search"
        placeholder="Search by title…"
        aria-label="Search tasks by title"
        value={value.search}
        onChange={(e) => onChange({ ...value, search: e.target.value })}
      />
      <select
        aria-label="Filter by status"
        value={value.status}
        onChange={(e) =>
          onChange({ ...value, status: e.target.value as TaskStatus | '' })
        }
      >
        <option value="">All statuses</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>
      <select
        aria-label="Filter by priority"
        value={value.priority}
        onChange={(e) =>
          onChange({
            ...value,
            priority: e.target.value as TaskPriority | '',
          })
        }
      >
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>
    </div>
  );
}
