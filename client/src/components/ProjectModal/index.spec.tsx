import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import ProjectModal from '.';
import { renderWithProviders } from '../../utils/redux.utils';
import { Project } from '../../types/project.types';

describe('ProjectModal', () => {
  const groupId = 1;
  const project: Project = {
    id: 1,
    name: 'New Project',
    description: 'Description',
    createdAt: Date.toString(),
    updatedAt: Date.toString(),
  };

  it('renders Add new project button in add mode', () => {
    renderWithProviders(<ProjectModal groupId={groupId} type='add' />);

    const addButton = screen.getByRole('button', { name: 'Create Project' });
    expect(addButton).toBeInTheDocument();
  });

  it('renders Edit Project button in edit mode', () => {
    renderWithProviders(
      <ProjectModal groupId={groupId} type='edit' project={project} />
    );

    const editButton = screen.getByRole('button', { name: 'Edit Project' });
    expect(editButton).toBeInTheDocument();
  });

  it('opens modal on Add new project button click', () => {
    renderWithProviders(<ProjectModal groupId={groupId} type='add' />);

    const addButton = screen.getByRole('button', { name: 'Create Project' });
    fireEvent.click(addButton);

    const modalTitle = screen.getByRole('heading', {
      name: 'Create New Project',
    });
    expect(modalTitle).toBeInTheDocument();
  });

  it('opens modal on Edit Project button click', () => {
    renderWithProviders(
      <ProjectModal groupId={groupId} type='edit' project={project} />
    );

    const editButton = screen.getByRole('button', { name: 'Edit Project' });
    fireEvent.click(editButton);

    const modalTitle = screen.getByRole('heading', { name: 'Edit Project' });
    expect(modalTitle).toBeInTheDocument();
  });
});
