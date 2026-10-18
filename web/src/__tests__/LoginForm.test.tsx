import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/LoginForm';

const push = jest.fn();
const setAuth = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

jest.mock('@/store/authStore', () => ({
  useAuthStore: (selector: (s: { setAuth: typeof setAuth }) => unknown) =>
    selector({ setAuth }),
}));

jest.mock('@/lib/api', () => ({
  api: {
    login: jest.fn(),
    register: jest.fn(),
  },
}));

import { api } from '@/lib/api';

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('submits login credentials and redirects', async () => {
    const user = userEvent.setup();
    (api.login as jest.Mock).mockResolvedValue({
      token: 'tok',
      user: { id: '1', email: 'a@example.com' },
    });

    render(<LoginForm mode="login" />);

    await user.type(screen.getByLabelText(/email/i), 'a@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret12');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('a@example.com', 'secret12');
      expect(setAuth).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error message on failure', async () => {
    const user = userEvent.setup();
    (api.login as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));

    render(<LoginForm mode="login" />);

    await user.type(screen.getByLabelText(/email/i), 'a@example.com');
    await user.type(screen.getByLabelText(/password/i), 'bad');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Invalid email or password'
    );
  });
});
