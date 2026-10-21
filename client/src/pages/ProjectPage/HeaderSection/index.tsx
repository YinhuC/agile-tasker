import React, { useEffect, useMemo } from 'react';
import { Container, Title, Text, Box, ContainerProps } from '@mantine/core';
import { Link } from 'react-router';
import { TbArrowLeft } from 'react-icons/tb';
import { fetchProjectThunk } from '../../../store/project/project.thunks';
import CategoryModal from '../../../components/CategoryModal';
import { useAppDispatch } from '../../../hooks/useAppDispatch';
import { useAppSelector } from '../../../hooks/useAppSelector';
import { useAuth } from '../../../hooks/useAuth';
import classes from './HeaderSection.module.css';

type HeaderSectionProps = ContainerProps & {
  projectId: string;
  missing: boolean;
};

function HeaderSection({ projectId, missing, ...props }: HeaderSectionProps) {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const projects = useAppSelector((state) => state.projects.projects);

  const project = useMemo(
    () => projects.find((project) => project.id === parseInt(projectId)),
    [projectId, projects]
  );

  useEffect(() => {
    dispatch(fetchProjectThunk(projectId));
  }, [dispatch, projectId]);

  return (
    <Container size='xl' className={classes.root} {...props}>
      {user && (
        <Link to={`/boards/${user.id}`} className={classes.back}>
          <TbArrowLeft aria-hidden />
          Workspaces
        </Link>
      )}
      <div className={classes.row}>
        <Box>
          <Title order={1} className={classes.title}>
            {missing ? 'Project not found.' : project?.name}
          </Title>
          {missing && (
            <Text className={classes.description}>
              It was deleted, or it belongs to another account.
            </Text>
          )}
          {!missing && project?.description && (
            <Text className={classes.description}>{project.description}</Text>
          )}
        </Box>
        {project && <CategoryModal type='add' projectId={project.id} />}
      </div>
    </Container>
  );
}

export default HeaderSection;
