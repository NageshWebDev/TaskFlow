import { render, screen } from '@testing-library/react';
import { ProjectTaskCard } from '@/components/ProjectTaskCard';
import type { Task } from '@/lib/types';

function task(overrides: Partial<Task> = {}): Task {
  return {
    id: '1',
    projectId: 'p1',
    title: 'Listed',
    description: 'Details',
    status: 'In Progress',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('ProjectTaskCard', () => {
  it('shows status, description, and actions without an Open link', () => {
    render(
      <ProjectTaskCard task={task()} onEdit={() => undefined} onDelete={() => undefined} />,
    );
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
    expect(screen.getByLabelText('Task actions for Listed')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /open/i })).not.toBeInTheDocument();
  });
});
