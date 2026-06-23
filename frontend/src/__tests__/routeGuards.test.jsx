import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import AdminRoute from '../pages/Admin/AdminRoute';
import PrivateRoute from '../pages/Auth/PrivateRoute';

const renderGuard = (guard, userInfo) => {
  const store = configureStore({
    reducer: {
      auth: () => ({ userInfo }),
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={guard}>
            <Route path="/protected" element={<h1>Protected Content</h1>} />
          </Route>
          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('route guards', () => {
  it('should redirect anonymous users away from private routes', () => {
    renderGuard(<PrivateRoute />, null);

    expect(screen.getByRole('heading', { name: /login page/i })).toBeInTheDocument();
  });

  it('should allow logged-in users into private routes', () => {
    renderGuard(<PrivateRoute />, { username: 'User', isAdmin: false });

    expect(screen.getByRole('heading', { name: /protected content/i })).toBeInTheDocument();
  });

  it('should reject non-admin users from admin routes', () => {
    renderGuard(<AdminRoute />, { username: 'User', isAdmin: false });

    expect(screen.getByRole('heading', { name: /login page/i })).toBeInTheDocument();
  });

  it('should allow admin users into admin routes', () => {
    renderGuard(<AdminRoute />, { username: 'Admin', isAdmin: true });

    expect(screen.getByRole('heading', { name: /protected content/i })).toBeInTheDocument();
  });
});
