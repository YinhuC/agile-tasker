import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import CategoryModal from '.';
import { renderWithProviders } from '../../utils/redux.utils';
import { Category } from '../../types/category.types';

describe('CategoryModal', () => {
  const projectId = 1;
  const category: Category = {
    id: 0,
    name: 'Category 1',
    index: 0,
    createdAt: Date.toString(),
  };

  it('renders Create Category button in add mode', () => {
    renderWithProviders(<CategoryModal projectId={projectId} type='add' />);

    const addButton = screen.getByRole('button', { name: 'New list' });
    expect(addButton).toBeInTheDocument();
  });

  it('renders Edit Category button in edit mode', () => {
    renderWithProviders(
      <CategoryModal projectId={projectId} type='edit' category={category} />
    );

    const editButton = screen.getByRole('button', { name: 'Edit list' });
    expect(editButton).toBeInTheDocument();
  });

  it('opens modal on Create Category button click', () => {
    renderWithProviders(<CategoryModal projectId={projectId} type='add' />);

    const addButton = screen.getByRole('button', { name: 'New list' });
    fireEvent.click(addButton);

    const modalTitle = screen.getByRole('heading', {
      name: 'New list',
    });
    expect(modalTitle).toBeInTheDocument();
  });

  it('opens modal on Edit Category button click', () => {
    renderWithProviders(
      <CategoryModal projectId={projectId} type='edit' category={category} />
    );

    const editButton = screen.getByRole('button', { name: 'Edit list' });
    fireEvent.click(editButton);

    const modalTitle = screen.getByRole('heading', { name: 'Edit list' });
    expect(modalTitle).toBeInTheDocument();
  });
});
