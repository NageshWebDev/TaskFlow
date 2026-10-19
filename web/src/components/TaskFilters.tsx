'use client';

import type { TaskPriority, TaskStatus } from '@/lib/types';
import { ALL_STATUS_WITH_OVERDUE, TASK_PRIORITY_FILTER } from '@/lib/taskOptions';
import { FilterSearch, FilterSelect } from '@/components/FilterControl';

export interface TaskFilterValues {
  status: TaskStatus | 'overdue' | '';
  priority: TaskPriority | '';
  search: string;
}

const STATUS_ITEMS = ALL_STATUS_WITH_OVERDUE.map((item) => {
  if (item.value === 'all') return item;
  const dots: Record<string, string> = {
    'To Do': 'bg-status-todo',
    'In Progress': 'bg-status-progress',
    Done: 'bg-status-done',
    overdue: 'bg-status-overdue',
  };
  return { ...item, dotClass: dots[item.value] };
});

interface TaskFiltersProps {
  value: TaskFilterValues;
  onChange: (next: TaskFilterValues) => void;
}

export function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <div
      className="flex flex-wrap items-stretch gap-[var(--space-3)]"
      data-testid="task-filters"
    >
      <FilterSearch
        placeholder="Search by title..."
        aria-label="Search tasks by title"
        value={value.search}
        onChange={(search) => onChange({ ...value, search })}
      />
      <div className="w-full sm:w-[var(--filter-select-w)] sm:shrink-0">
        <FilterSelect
          aria-label="Filter by status"
          value={value.status || 'all'}
          onValueChange={(next) =>
            onChange({
              ...value,
              status: next === 'all' ? '' : (next as TaskStatus | 'overdue'),
            })
          }
          items={STATUS_ITEMS}
          active={Boolean(value.status)}
        />
      </div>
      <div className="w-full sm:w-[var(--filter-select-w)] sm:shrink-0">
        <FilterSelect
          aria-label="Filter by priority"
          value={value.priority || 'all'}
          onValueChange={(next) =>
            onChange({
              ...value,
              priority: next === 'all' ? '' : (next as TaskPriority),
            })
          }
          items={TASK_PRIORITY_FILTER}
          active={Boolean(value.priority)}
        />
      </div>
    </div>
  );
}
