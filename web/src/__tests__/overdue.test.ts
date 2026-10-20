import { isOverdue, partitionTaskStatus, sortLaneTasks } from '@/lib/overdue';
import type { Task } from '@/lib/types';

const now = new Date(2026, 9, 18, 15, 0, 0);

function task(overrides: Partial<Task>): Task {
  return {
    id: '1',
    projectId: 'p',
    title: 'Task',
    description: '',
    status: 'To Do',
    priority: 'Low',
    dueDate: new Date(2026, 9, 18, 12, 0, 0).toISOString(),
    createdAt: now.toISOString(),
    ...overrides,
  };
}

describe('overdue', () => {
  it('marks past-due open tasks, not Done or due today', () => {
    const yesterday = new Date(2026, 9, 17, 12, 0, 0).toISOString();
    const today = new Date(2026, 9, 18, 0, 0, 0).toISOString();
    expect(isOverdue(task({ dueDate: yesterday }), now)).toBe(true);
    expect(isOverdue(task({ status: 'Done', dueDate: yesterday }), now)).toBe(false);
    expect(isOverdue(task({ dueDate: today }), now)).toBe(false);
  });

  it('sorts overdue first, then earlier due dates', () => {
    const overdue = task({ id: 'a', dueDate: new Date(2026, 9, 10).toISOString() });
    const later = task({ id: 'b', dueDate: new Date(2026, 9, 22).toISOString() });
    const sooner = task({ id: 'c', dueDate: new Date(2026, 9, 20).toISOString() });
    expect(sortLaneTasks([later, overdue, sooner]).map((t) => t.id)).toEqual([
      'a',
      'c',
      'b',
    ]);
  });

  it('partitions overdue out of To Do and In Progress', () => {
    const past = new Date(2026, 9, 10).toISOString();
    const future = new Date(2026, 9, 22).toISOString();
    expect(
      partitionTaskStatus(
        [
          task({ id: '1', status: 'To Do', dueDate: past }),
          task({ id: '2', status: 'To Do', dueDate: future }),
          task({ id: '3', status: 'In Progress', dueDate: past }),
          task({ id: '4', status: 'Done', dueDate: past }),
        ],
        now,
      ),
    ).toEqual({ done: 1, progress: 0, todo: 1, overdue: 2 });
  });
});
