import React from 'react';
import { renderWithMantine } from '../../utils/test.utils';
import { BrowserRouter, Route, Routes } from 'react-router';
import AuthRoute from '.';
import { screen } from '@testing-library/react';
import LoginPage from '../../pages/LoginPage';
import type { Mock } from 'vitest';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('AuthRoute', () => {
  const useAuthmodule = useAuth as Mock;

  beforeEach(() => {
    useAuthmodule.mockClear();
  });

  it('renders the child components when user is authenticated', () => {
    useAuthmodule.mockReturnValueOnce({
      user: { id: 1, name: 'John' },
      loading: false,
    });

    renderWithMantine(
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route element={<AuthRoute />}>
            <Route path='/' element={<div>Protected Route</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    const protectedRoute = screen.getByText('Protected Route');
    expect(protectedRoute).toBeInTheDocument();
  });

  it('redirects to the login page when user is not authenticated', () => {
    useAuthmodule.mockReturnValueOnce({
      user: null,
      loading: false,
    });

    renderWithMantine(
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<div>Login.</div>} />
          <Route element={<AuthRoute />}>
            <Route path='/' element={<div>Protected Route</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );

    const protectedRoute = screen.queryByText('Protected Route');
    expect(protectedRoute).not.toBeInTheDocument();

    const loginPage = screen.queryByText('Login.');
    expect(loginPage).toBeInTheDocument();
  });
});
