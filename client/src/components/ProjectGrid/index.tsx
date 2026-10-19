import React, { useEffect, useMemo } from 'react';
import { Title, SimpleGrid, Box, BoxProps, Text } from '@mantine/core';
import ProjectCard from '../ProjectCard';
import { Group } from '../../types/group.types';
import { fetchAllProjectsThunk } from '../../store/project/project.thunks';
import ProjectModal from '../ProjectModal';
import GroupModal from '../GroupModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import classes from './ProjectGrid.module.css';

type ProjectGridProps = BoxProps & {
  group: Group;
};

/** One workspace as a steel rack panel holding its project cards. */
function ProjectGrid({ group, ...props }: ProjectGridProps) {
  const { name, id } = group;
  const dispatch = useAppDispatch();
  const allProjects = useAppSelector((state) => state.projects.projects);

  const projects = useMemo(
    () => allProjects.filter((project) => project.group?.id === id),
    [allProjects, id]
  );

  useEffect(() => {
    dispatch(fetchAllProjectsThunk({ groupId: id }));
  }, [dispatch, id]);

  return (
    <Box component='section' className={classes.root} {...props}>
      <div className={classes.head}>
        <div className={classes.name}>
          <Title order={2} className={classes.title}>
            {name}
          </Title>
          <span className={classes.count}>
            {String(projects.length).padStart(2, '0')}
          </span>
          <GroupModal type='edit' group={group} />
        </div>
        <ProjectModal groupId={id} type='add' />
      </div>
      {projects.length === 0 ? (
        <Text className={classes.empty}>
          No projects in this workspace yet.
        </Text>
      ) : (
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing='md'>
          {projects.map((project, index) => (
            <ProjectCard
              project={project}
              groupId={id}
              key={`project-card-${index}`}
            />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

export default ProjectGrid;
