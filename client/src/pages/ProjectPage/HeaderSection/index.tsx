import React, { useEffect, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  Flex,
  Box,
  ContainerProps,
} from '@mantine/core';
import { fetchProjectThunk } from '../../../store/project/project.thunks';
import CategoryModal from '../../../components/CategoryModal';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';

type HeaderSectionProps = ContainerProps & {
  projectId: string;
};

function HeaderSection({ projectId, ...props }: HeaderSectionProps) {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => state.projects.projects);

  const project = useMemo(
    () => projects.find((project) => project.id === parseInt(projectId)),
    [projectId, projects]
  );

  useEffect(() => {
    dispatch(fetchProjectThunk(projectId));
  }, [dispatch, projectId]);

  return (
    <Container
      size='xl'
      mb={30}
      px={40}
      pt={20}
      style={{ userSelect: 'none' }}
      {...props}
    >
      <Flex
        justify='space-between'
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'center', sm: 'end' }}
      >
        <Box mr={{ base: 0, sm: 50 }} ta={{ base: 'center', sm: 'left' }}>
          <Title order={2} mb={10}>
            {project?.name}
          </Title>
          <Text ml={2}>{project?.description}</Text>
        </Box>
        {project && <CategoryModal type='add' projectId={project.id} />}
      </Flex>
    </Container>
  );
}

export default HeaderSection;
