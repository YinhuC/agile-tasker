import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { Mock } from 'vitest';
import ProjectPage from '.';
import API from '../../api';
import { setupStore } from '../../store';
import { useAuth } from '../../hooks/useAuth';
import { showGeneralError } from '../../utils/notification.utils';
import { renderWithMantine } from '../../utils/test.utils';

vi.mock('../../api', () => ({
  default: {
    project: {
      getProject: vi.fn(),
      getBoard: vi.fn(),
    },
  },
}));
vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));
vi.mock('../../utils/notification.utils', () => ({
  showGeneralError: vi.fn(),
}));

describe('ProjectPage', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows the not-found state when the project does not exist', async () => {
    (useAuth as Mock).mockReturnValue({ user: { id: 1 }, loading: false });
    vi.mocked(API.project).getProject.mockRejectedValue({
      response: { status: 404 },
    });
    vi.mocked(API.project).getBoard.mockRejectedValue({
      response: { status: 404 },
    });

    renderWithMantine(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/project/99']}>
          <Routes>
            <Route path='/project/:id' element={<ProjectPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(
      await screen.findByRole('heading', { name: 'Project not found.' })
    ).toBeInTheDocument();
    expect(
      screen.queryByText('No lists yet. Add one to start placing cards.')
    ).not.toBeInTheDocument();
    expect(showGeneralError).not.toHaveBeenCalled();
  });

  it('shows the general error when the board fails to load for another reason', async () => {
    (useAuth as Mock).mockReturnValue({ user: { id: 1 }, loading: false });
    vi.mocked(API.project).getProject.mockRejectedValue({});
    vi.mocked(API.project).getBoard.mockRejectedValue({});

    renderWithMantine(
      <Provider store={setupStore()}>
        <MemoryRouter initialEntries={['/project/99']}>
          <Routes>
            <Route path='/project/:id' element={<ProjectPage />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => expect(showGeneralError).toHaveBeenCalledTimes(1));
    expect(showGeneralError).toHaveBeenCalledWith();
    expect(
      screen.queryByRole('heading', { name: 'Project not found.' })
    ).not.toBeInTheDocument();
  });
});
