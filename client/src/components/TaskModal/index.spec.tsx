import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import TaskModal from '.';
import { renderWithProviders } from '../../utils/redux.utils';
import { Task } from '../../types/task.types';

describe('TaskModal', () => {
  const categoryId = 1;
  const task: Task = {
    id: 1,
    name: 'Task 1',
    description: 'This is Task 1',
    index: 1,
    createdAt: Date.toString(),
  };

  it('renders Add new task button in add mode', () => {
    renderWithProviders(<TaskModal categoryId={categoryId} type='add' />);

    const addButton = screen.getByRole('button', { name: 'Create Task' });
    expect(addButton).toBeInTheDocument();
  });

  it('renders Edit Task button in edit mode', () => {
    renderWithProviders(
      <TaskModal categoryId={categoryId} type='edit' task={task} />
    );

    const editButton = screen.getByRole('button', { name: 'Edit Task' });
    expect(editButton).toBeInTheDocument();
  });

  it('opens modal on Add new task button click', () => {
    renderWithProviders(<TaskModal categoryId={categoryId} type='add' />);

    const addButton = screen.getByRole('button', { name: 'Create Task' });
    fireEvent.click(addButton);

    const modalTitle = screen.getByRole('heading', { name: 'Create New Task' });
    expect(modalTitle).toBeInTheDocument();
  });

  it('opens modal on Edit Task button click', () => {
    renderWithProviders(
      <TaskModal categoryId={categoryId} type='edit' task={task} />
    );

    const editButton = screen.getByRole('button', { name: 'Edit Task' });
    fireEvent.click(editButton);

    const modalTitle = screen.getByRole('heading', { name: 'Edit Task' });
    expect(modalTitle).toBeInTheDocument();
  });
});
