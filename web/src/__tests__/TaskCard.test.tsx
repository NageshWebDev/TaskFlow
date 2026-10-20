import { render, screen } from '@testing-library/react';
import { TaskCard } from '@/components/TaskCard';
import type { Task } from '@/lib/types';

const task: Task = {
  id: '1',
  projectId: 'p1',
  projectName: 'Website',
  title: 'Write docs',
  description: '',
  status: 'To Do',
  priority: 'High',
  dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
  createdAt: new Date().toISOString(),
};

describe('TaskCard', () => {
  it('shows overdue and Open link with filters', () => {
    render(<TaskCard task={task} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.queryByText('To Do')).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Open Write docs/ })).toHaveAttribute(
      'href',
      '/projects/p1?status=todo&priority=high&q=Write+docs',
    );
  });
});
