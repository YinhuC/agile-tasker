import React from 'react';
import { Text, Title, Button, BoxProps } from '@mantine/core';
import { Link } from 'react-router';
import ProjectModal from '../ProjectModal';
import StockCard from '../StockCard';
import { Project } from '../../types/project.types';
import classes from './ProjectCard.module.css';

type ProjectCardProps = BoxProps & {
  project: Project;
  groupId: number;
};

/** A project printed on blue sleeve stock, opening onto its board. */
function ProjectCard({ project, groupId, ...props }: ProjectCardProps) {
  const { name, description, id } = project;

  return (
    <StockCard stock='blue' className={classes.root} {...props}>
      <div className={classes.head}>
        <span className={classes.id}>P-{String(id).padStart(3, '0')}</span>
        <ProjectModal groupId={groupId} type='edit' project={project} />
      </div>
      <Title order={3} className={classes.title}>
        {name}
      </Title>
      <Text className={classes.description}>
        {description || 'No description.'}
      </Text>
      <Button
        component={Link}
        variant='ink'
        fullWidth
        to={`/project/${id}`}
        aria-label={`Open ${name}`}
        mt='auto'
      >
        Open board
      </Button>
    </StockCard>
  );
}

export default ProjectCard;
