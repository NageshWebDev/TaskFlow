import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmptyState } from '@/components/EmptyState';
import { TaskFilters, TaskFilterValues } from '@/components/TaskFilters';
import { useState } from 'react';

function FiltersHarness({
  onChangeSpy,
}: {
  onChangeSpy: (v: TaskFilterValues) => void;
}) {
  const [value, setValue] = useState<TaskFilterValues>({
    status: '',
    priority: '',
    search: '',
  });

  return (
    <>
      <TaskFilters
        value={value}
        onChange={(next) => {
          setValue(next);
          onChangeSpy(next);
        }}
      />
      {value.status === 'Done' && value.search === 'none' ? (
        <EmptyState
          title="No matching tasks"
          message="Try clearing filters or create a new task above."
        />
      ) : null}
    </>
  );
}

describe('TaskFilters and empty state', () => {
  it('updates status, priority and search filters', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    render(<FiltersHarness onChangeSpy={spy} />);

    await user.type(screen.getByLabelText(/search tasks by title/i), 'api');
    await user.click(screen.getByLabelText(/filter by status/i));
    await user.click(await screen.findByRole('option', { name: 'To Do' }));
    await user.click(screen.getByLabelText(/filter by priority/i));
    await user.click(await screen.findByRole('option', { name: 'High' }));

    expect(spy).toHaveBeenCalled();
    expect(screen.getByLabelText(/filter by status/i)).toHaveTextContent('To Do');
    expect(screen.getByLabelText(/filter by priority/i)).toHaveTextContent('High');
    expect(screen.getByLabelText(/search tasks by title/i)).toHaveValue('api');
  });

  it('renders empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<FiltersHarness onChangeSpy={jest.fn()} />);

    await user.clear(screen.getByLabelText(/search tasks by title/i));
    await user.type(screen.getByLabelText(/search tasks by title/i), 'none');
    await user.click(screen.getByLabelText(/filter by status/i));
    await user.click(await screen.findByRole('option', { name: 'Done' }));

    expect(screen.getByRole('status')).toHaveTextContent('No matching tasks');
    expect(screen.getByRole('status')).toHaveTextContent(
      'Try clearing filters or create a new task above.'
    );
  });
});
