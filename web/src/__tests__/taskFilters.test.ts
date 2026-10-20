import { isOverdue } from '@/lib/overdue';
import {
  filterTasks,
  parseTaskFilters,
  projectTaskHref,
  serializeTaskFilters,
} from '@/lib/taskFilters';
import type { Task } from '@/lib/types';

function task(overrides: Partial<Task>): Task {
  return {
    id: '1',
    projectId: 'p1',
    projectName: 'Website',
    title: 'Write docs',
    description: '',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('taskFilters', () => {
  it('builds a project href with task filters', () => {
    expect(
      projectTaskHref(
        task({ projectId: 'abc', title: 'Write docs', status: 'Done', priority: 'Low' }),
      ),
    ).toBe('/projects/abc?status=done&priority=low&q=Write+docs');
  });

  it('round-trips filters in the URL', () => {
    const query = serializeTaskFilters({
      project: 'abc',
      status: 'overdue',
      priority: 'High',
      q: 'api',
    });
    expect(query).toBe('project=abc&status=overdue&priority=high&q=api');
    expect(parseTaskFilters(new URLSearchParams(query))).toEqual({
      project: 'abc',
      status: 'overdue',
      priority: 'High',
      q: 'api',
    });
  });

  it('ANDs filters and keeps overdue on real status', () => {
    const items = [
      task({ id: 'a', title: 'Alpha', status: 'To Do' }),
      task({
        id: 'b',
        title: 'Beta',
        projectId: 'p2',
        projectName: 'Mobile',
        status: 'In Progress',
        priority: 'Low',
      }),
      task({
        id: 'c',
        title: 'Gamma',
        dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
      }),
    ];

    expect(
      filterTasks(items, {
        project: 'p1',
        status: 'To Do',
        priority: 'High',
        q: '',
      }).map((t) => t.id),
    ).toEqual(['a', 'c']);

    const overdue = filterTasks(items, {
      project: 'all',
      status: 'overdue',
      priority: 'all',
      q: '',
    });
    expect(overdue).toHaveLength(1);
    expect(overdue[0].status).toBe('To Do');
    expect(isOverdue(overdue[0])).toBe(true);
  });
});
