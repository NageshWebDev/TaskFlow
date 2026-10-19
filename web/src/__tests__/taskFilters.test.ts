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

describe('projectTaskHref', () => {
  it('opens the project page with filters for that task', () => {
    expect(
      projectTaskHref(
        task({
          projectId: 'abc',
          title: 'Write docs',
          status: 'Done',
          priority: 'Low',
        }),
      ),
    ).toBe('/projects/abc?status=done&priority=low&q=Write+docs');
  });
});

describe('task filter query string', () => {
  it('round-trips filters into the URL', () => {
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
});

describe('filterTasks AND logic', () => {
  const items = [
    task({ id: 'a', title: 'Alpha', projectName: 'Website', status: 'To Do' }),
    task({
      id: 'b',
      title: 'Beta',
      projectName: 'Mobile',
      projectId: 'p2',
      status: 'In Progress',
      priority: 'Low',
    }),
    task({
      id: 'c',
      title: 'Gamma',
      status: 'To Do',
      dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    }),
  ];

  it('matches title or project name case-insensitively', () => {
    const byTitle = filterTasks(items, {
      project: 'all',
      status: 'all',
      priority: 'all',
      q: 'ALPHA',
    });
    const byProject = filterTasks(items, {
      project: 'all',
      status: 'all',
      priority: 'all',
      q: 'mobile',
    });
    expect(byTitle.map((item) => item.id)).toEqual(['a']);
    expect(byProject.map((item) => item.id)).toEqual(['b']);
  });

  it('combines project, status, and priority', () => {
    const result = filterTasks(items, {
      project: 'p1',
      status: 'To Do',
      priority: 'High',
      q: '',
    });
    expect(result.map((item) => item.id).sort()).toEqual(['a', 'c']);
  });

  it('keeps overdue tasks in their real status', () => {
    const result = filterTasks(items, {
      project: 'all',
      status: 'overdue',
      priority: 'all',
      q: '',
    });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('c');
    expect(result[0].status).toBe('To Do');
    expect(isOverdue(result[0])).toBe(true);
  });
});
