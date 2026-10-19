import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import GroupModal from '.';
import { renderWithProviders } from '../../utils/redux.utils';
import { Group } from '../../types/group.types';

describe('GroupModal', () => {
  const group: Group = {
    id: 0,
    name: 'Group 1',
    createdAt: Date.toString(),
  };

  it('renders Add new group button in add mode', () => {
    renderWithProviders(<GroupModal type='add' />);

    const addButton = screen.getByRole('button', { name: 'New workspace' });
    expect(addButton).toBeInTheDocument();
  });

  it('renders Edit Group button in edit mode', () => {
    renderWithProviders(<GroupModal type='edit' group={group} />);

    const editButton = screen.getByRole('button', { name: 'Edit workspace' });
    expect(editButton).toBeInTheDocument();
  });

  it('opens modal on Add new group button click', () => {
    renderWithProviders(<GroupModal type='add' />);

    const addButton = screen.getByRole('button', { name: 'New workspace' });
    fireEvent.click(addButton);

    const modalTitle = screen.getByRole('heading', {
      name: 'New workspace',
    });
    expect(modalTitle).toBeInTheDocument();
  });

  it('opens modal on Edit Group button click', () => {
    renderWithProviders(<GroupModal type='edit' group={group} />);

    const editButton = screen.getByRole('button', { name: 'Edit workspace' });
    fireEvent.click(editButton);

    const modalTitle = screen.getByRole('heading', { name: 'Edit workspace' });
    expect(modalTitle).toBeInTheDocument();
  });
});
