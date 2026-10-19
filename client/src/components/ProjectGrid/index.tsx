import React, { useEffect, useMemo } from 'react';
import { Title, SimpleGrid, Stack, Flex, StackProps } from '@mantine/core';
import ProjectCard from '../ProjectCard';
import { Group } from '../../types/group.types';
import { fetchAllProjectsThunk } from '../../store/project/project.thunks';
import ProjectModal from '../ProjectModal';
import GroupModal from '../GroupModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

type ProjectGridProps = StackProps & {
  group: Group;
};

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

  const cards = useMemo(
    () =>
      projects.length === 0 ? (
        <></>
      ) : (
        projects.map((project, index) => (
          <ProjectCard
            project={project}
            groupId={id}
            key={`project-card-${index}`}
          />
        ))
      ),

    [id, projects]
  );

  return (
    <Stack
      mb={40}
      px={40}
      pt={30}
      pb={40}
      bg='gray.0'
      style={{ borderRadius: '0.3rem' }}
      {...props}
    >
      <Flex
        justify='space-between'
        align='center'
        mb={10}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Flex align='center'>
          <Title order={3} mx={5} fw={500}>
            {name}
          </Title>
          <GroupModal type='edit' group={group} />
        </Flex>
        <ProjectModal groupId={id} type='add' />
      </Flex>
      <SimpleGrid
        cols={{ base: 1, xs: 2, sm: 3 }}
        spacing={{ base: 'sm', sm: 'md' }}
      >
        {cards}
      </SimpleGrid>
    </Stack>
  );
}

export default ProjectGrid;
