import type { Task, TaskStatus } from './types';

export function startOfLocalDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Overdue when the due date is before today (local calendar day) and status is not Done. */
export function isOverdue(
  task: Pick<Task, 'dueDate' | 'status'>,
  now: Date = new Date(),
): boolean {
  if (task.status === 'Done') return false;
  const due = startOfLocalDay(new Date(task.dueDate));
  const today = startOfLocalDay(now);
  return due.getTime() < today.getTime();
}

export function dueDateSortValue(dueDate: string): number {
  return startOfLocalDay(new Date(dueDate)).getTime();
}

export function sortLaneTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const overdueDelta = Number(isOverdue(b)) - Number(isOverdue(a));
    if (overdueDelta !== 0) return overdueDelta;
    return dueDateSortValue(a.dueDate) - dueDateSortValue(b.dueDate);
  });
}

export function countByStatus(tasks: Task[]): Record<TaskStatus | 'overdue', number> {
  return {
    'To Do': tasks.filter((task) => task.status === 'To Do').length,
    'In Progress': tasks.filter((task) => task.status === 'In Progress').length,
    Done: tasks.filter((task) => task.status === 'Done').length,
    overdue: tasks.filter((task) => isOverdue(task)).length,
  };
}

/** Lane counts with overdue removed so slices sum to the task total. */
export function partitionTaskStatus(tasks: Task[], now: Date = new Date()) {
  let done = 0;
  let progress = 0;
  let todo = 0;
  let overdue = 0;
  for (const task of tasks) {
    if (isOverdue(task, now)) overdue += 1;
    else if (task.status === 'Done') done += 1;
    else if (task.status === 'In Progress') progress += 1;
    else todo += 1;
  }
  return { done, progress, todo, overdue };
}
