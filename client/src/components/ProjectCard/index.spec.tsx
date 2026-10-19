import React from 'react';
import { screen } from '@testing-library/react';
import ProjectCard from '.';
import ProjectModal from '../ProjectModal';
import { renderWithProviders } from '../../utils/redux.utils';
import { Project } from '../../types/project.types';
import { BrowserRouter as Router } from 'react-router';

vi.mock('../ProjectModal', () => ({
  default: vi.fn(() => <div>ProjectModal</div>),
}));

describe('ProjectCard', () => {
  const project: Project = {
    id: 1,
    name: 'Project 1',
    description: 'This is Project 1',
    createdAt: Date.toString(),

    updatedAt: Date.toString(),
  };
  const groupId = 1;

  it('renders the project name and description', () => {
    renderWithProviders(
      <Router>
        <ProjectCard project={project} groupId={groupId} />
      </Router>
    );

    const projectName = screen.getByText('Project 1');
    const projectDescription = screen.getByText('This is Project 1');

    expect(projectName).toBeInTheDocument();
    expect(projectDescription).toBeInTheDocument();
  });

  it('renders the ProjectModal component with the correct props', () => {
    renderWithProviders(
      <Router>
        <ProjectCard project={project} groupId={groupId} />
      </Router>
    );

    const ProjectModalProps = {
      type: 'edit',
      groupId: 1,
      project: project,
    };

    expect(ProjectModal).toHaveBeenCalledWith(ProjectModalProps, undefined);
  });
});
