import { countByStatus, isOverdue, partitionTaskStatus, sortLaneTasks } from '@/lib/overdue';
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

describe('isOverdue', () => {
  it('marks To Do and In Progress past due as overdue', () => {
    const yesterday = new Date(2026, 9, 17, 12, 0, 0).toISOString();
    expect(isOverdue(task({ status: 'To Do', dueDate: yesterday }), now)).toBe(true);
    expect(
      isOverdue(task({ status: 'In Progress', dueDate: yesterday }), now),
    ).toBe(true);
  });

  it('does not mark Done as overdue even if the due date has passed', () => {
    const yesterday = new Date(2026, 9, 17, 12, 0, 0).toISOString();
    expect(isOverdue(task({ status: 'Done', dueDate: yesterday }), now)).toBe(false);
  });

  it('does not mark tasks due today as overdue', () => {
    const todayMorning = new Date(2026, 9, 18, 0, 0, 0).toISOString();
    expect(isOverdue(task({ dueDate: todayMorning }), now)).toBe(false);
  });

  it('does not mark future due dates as overdue', () => {
    const tomorrow = new Date(2026, 9, 19, 12, 0, 0).toISOString();
    expect(isOverdue(task({ dueDate: tomorrow }), now)).toBe(false);
  });
});

describe('sortLaneTasks', () => {
  it('puts overdue tasks first, then earlier due dates', () => {
    const overdue = task({
      id: 'a',
      dueDate: new Date(2026, 9, 10, 12, 0, 0).toISOString(),
    });
    const later = task({
      id: 'b',
      dueDate: new Date(2026, 9, 22, 12, 0, 0).toISOString(),
    });
    const sooner = task({
      id: 'c',
      dueDate: new Date(2026, 9, 20, 12, 0, 0).toISOString(),
    });
    expect(sortLaneTasks([later, overdue, sooner]).map((item) => item.id)).toEqual([
      'a',
      'c',
      'b',
    ]);
  });
});

describe('countByStatus', () => {
  it('counts overdue separately from status lanes', () => {
    const past = new Date(Date.now() - 86400000 * 4).toISOString();
    const future = new Date(Date.now() + 86400000 * 4).toISOString();
    const items = [
      task({ id: '1', status: 'To Do', dueDate: past }),
      task({ id: '2', status: 'In Progress', dueDate: future }),
      task({ id: '3', status: 'Done', dueDate: past }),
    ];
    expect(countByStatus(items)).toEqual({
      'To Do': 1,
      'In Progress': 1,
      Done: 1,
      overdue: 1,
    });
  });
});

describe('partitionTaskStatus', () => {
  it('moves overdue tasks out of To Do and In Progress', () => {
    const past = new Date(2026, 9, 10, 12, 0, 0).toISOString();
    const future = new Date(2026, 9, 22, 12, 0, 0).toISOString();
    const items = [
      task({ id: '1', status: 'To Do', dueDate: past }),
      task({ id: '2', status: 'To Do', dueDate: future }),
      task({ id: '3', status: 'In Progress', dueDate: past }),
      task({ id: '4', status: 'In Progress', dueDate: future }),
      task({ id: '5', status: 'Done', dueDate: past }),
    ];
    expect(partitionTaskStatus(items, now)).toEqual({
      done: 1,
      progress: 1,
      todo: 1,
      overdue: 2,
    });
  });
});
