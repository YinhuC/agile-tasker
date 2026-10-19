import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithMantine } from '../../utils/test.utils';
import { BrowserRouter as Router } from 'react-router';
import Header from '.';
import type { Mock } from 'vitest';
import { useAuth } from '../../hooks/useAuth';
import { postAuthLogout } from '../../api/auth.api';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../api/auth.api', () => ({
  postAuthLogout: vi.fn(),
}));

describe('Header', () => {
  const user = {
    id: 1,
    name: 'John Doe',
  };

  beforeEach(() => {
    const useAuthModule = useAuth as Mock;
    const postAuthLogoutModule = postAuthLogout as Mock;

    useAuthModule.mockReturnValue({
      user,
      removeUser: vi.fn(),
    });

    postAuthLogoutModule.mockResolvedValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo and navigation links', () => {
    renderWithMantine(
      <Router>
        <Header />
      </Router>
    );

    const logoLink = screen.getByRole('link', { name: 'agile tasker home' });
    const boardLink = screen.getByLabelText('Board');

    expect(logoLink).toBeInTheDocument();
    expect(boardLink).toBeInTheDocument();
  });

  it('renders the logout button when a user is authenticated', () => {
    renderWithMantine(
      <Router>
        <Header />
      </Router>
    );

    const logoutButton = screen.getByLabelText('Logout');

    expect(logoutButton).toBeInTheDocument();
  });

  it('renders the Sign In button when no user is authenticated', () => {
    const useAuthModule = useAuth as Mock;
    useAuthModule.mockReturnValue({
      user: null,
      removeUser: vi.fn(),
    });

    renderWithMantine(
      <Router>
        <Header />
      </Router>
    );

    const signInButton = screen.getByLabelText('Sign In');
    expect(signInButton).toBeInTheDocument();
  });
});
