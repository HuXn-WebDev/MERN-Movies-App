import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer from '../redux/features/auth/authSlice';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

const authMocks = vi.hoisted(() => ({
  login: vi.fn(),
  register: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
}));

vi.mock('../redux/api/users', () => ({
  useLoginMutation: () => [authMocks.login, { isLoading: false }],
  useRegisterMutation: () => [authMocks.register, { isLoading: false }],
}));

vi.mock('react-toastify', () => ({
  toast: {
    error: authMocks.toastError,
    success: authMocks.toastSuccess,
  },
}));

const renderAuthRoute = (route, element) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={element} />
          <Route path="/register" element={element} />
          <Route path="/profile" element={<h1>Profile Page</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

  return store;
};

describe('auth forms', () => {
  beforeEach(() => {
    authMocks.login.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          _id: 'user-1',
          username: 'Movie Fan',
          email: 'fan@test.com',
          isAdmin: false,
        }),
    });

    authMocks.register.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          _id: 'user-2',
          username: 'New Fan',
          email: 'new@test.com',
          isAdmin: false,
        }),
    });
  });

  it('should submit login credentials and navigate to redirect', async () => {
    const user = userEvent.setup();
    renderAuthRoute('/login?redirect=/profile', <Login />);

    await user.type(screen.getByLabelText(/email address/i), 'fan@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() =>
      expect(authMocks.login).toHaveBeenCalledWith({
        email: 'fan@test.com',
        password: 'password123',
      })
    );

    expect(await screen.findByRole('heading', { name: /profile page/i })).toBeInTheDocument();
  });

  it('should prevent registration when passwords do not match', async () => {
    const user = userEvent.setup();
    renderAuthRoute('/register', <Register />);

    await user.type(screen.getByLabelText(/^name$/i), 'New Fan');
    await user.type(screen.getByLabelText(/email address/i), 'new@test.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'different');
    await user.click(screen.getByRole('button', { name: /^register$/i }));

    expect(authMocks.register).not.toHaveBeenCalled();
    expect(authMocks.toastError).toHaveBeenCalledWith('Password do not match');
  });

  it('should register a user and store credentials', async () => {
    const user = userEvent.setup();
    renderAuthRoute('/register?redirect=/profile', <Register />);

    await user.type(screen.getByLabelText(/^name$/i), 'New Fan');
    await user.type(screen.getByLabelText(/email address/i), 'new@test.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password123');
    await user.type(screen.getByLabelText(/confirm password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /^register$/i }));

    await waitFor(() =>
      expect(authMocks.register).toHaveBeenCalledWith({
        username: 'New Fan',
        email: 'new@test.com',
        password: 'password123',
      })
    );

    expect(await screen.findByRole('heading', { name: /profile page/i })).toBeInTheDocument();
    expect(authMocks.toastSuccess).toHaveBeenCalledWith('User successfully registered.');
  });
});
