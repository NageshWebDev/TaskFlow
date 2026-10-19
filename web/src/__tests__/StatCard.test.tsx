import { render, screen } from '@testing-library/react';
import { Clock, CircleAlert, CircleCheck, Folder, ListChecks } from 'lucide-react';
import { StatCard } from '@/components/StatCard';

describe('StatCard', () => {
  it('uses a shared accent and derived secondary line', () => {
    render(
      <StatCard
        label="Total Projects"
        value={1284}
        secondary="1,284 active"
        icon={Folder}
      />,
    );

    expect(screen.getByRole('group', { name: 'Total Projects: 1,284' })).toBeInTheDocument();
    expect(screen.getByText('1,284')).toBeInTheDocument();
    expect(screen.getByText('1,284 active')).toBeInTheDocument();
  });

  it('shows 0% of all tasks without dividing by zero', () => {
    render(
      <StatCard
        label="Completed"
        value={0}
        secondary="0% of all tasks"
        icon={CircleCheck}
      />,
    );

    expect(screen.getByText('0% of all tasks')).toBeInTheDocument();
  });

  it('keeps overdue at 0 calm', () => {
    render(
      <StatCard
        label="Overdue"
        value={0}
        secondary="All on track"
        secondaryTone="success"
        icon={Clock}
        iconTone="neutral"
        groupLabel="Overdue: 0 tasks"
      />,
    );

    const card = screen.getByRole('group', { name: 'Overdue: 0 tasks' });
    expect(card).toHaveTextContent('All on track');
    expect(card).not.toHaveTextContent('Needs attention');
  });

  it('switches overdue above 0 to the danger state', () => {
    render(
      <StatCard
        label="Overdue"
        value={2}
        secondary="Needs attention"
        secondaryTone="danger"
        icon={CircleAlert}
        variant="danger"
        groupLabel="Overdue: 2 tasks"
      />,
    );

    expect(screen.getByRole('group', { name: 'Overdue: 2 tasks' })).toHaveTextContent(
      'Needs attention',
    );
  });

  it('omits the secondary line when it is not provided', () => {
    render(<StatCard label="Total Tasks" value={3} icon={ListChecks} />);

    expect(screen.queryByText(/in progress/i)).not.toBeInTheDocument();
  });
});
