import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';
import type { Task } from '@/lib/types';

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    projectId: 'p1',
    projectName: 'Website Redesign With A Very Long Name',
    title: 'Write a very long task title that should wrap instead of overflowing the card',
    description: '',
    status: 'To Do',
    priority: 'High',
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('TaskCard', () => {
  it('shows overdue styling without a status tag in board view', () => {
    render(<TaskCard task={task()} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText(/Due /)).toBeInTheDocument();
    expect(screen.queryByText('To Do')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Write a very long task title/ })).toHaveAttribute(
      'href',
      '/projects/p1?status=todo&priority=high&q=Write+a+very+long+task+title+that+should+wrap+instead+of+overflowing+the+card',
    );
  });

  it('does not treat a late Done task as overdue', () => {
    render(<TaskCard task={task({ status: 'Done', title: 'Shipped' })} />);
    expect(screen.getByText('Shipped')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
  });

  it('does not mark a task due today as overdue', () => {
    const dueToday = new Date();
    dueToday.setHours(8, 0, 0, 0);
    render(
      <TaskCard task={task({ title: 'Today', dueDate: dueToday.toISOString() })} />,
    );
    expect(screen.queryByText('Overdue')).not.toBeInTheDocument();
    expect(screen.getByText(/Due /)).toBeInTheDocument();
  });

  it('omits the due date when it is missing', () => {
    render(<TaskCard task={task({ dueDate: '', title: 'No date', priority: 'Low' })} />);
    expect(screen.queryByText(/Due /)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Priority: Low')).toBeInTheDocument();
  });
});
