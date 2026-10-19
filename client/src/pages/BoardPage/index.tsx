import React, { useEffect, useMemo } from 'react';
import { Box, Container, Title, Text } from '@mantine/core';
import { TbClockHour4 } from 'react-icons/tb';
import ProjectGrid from '../../components/ProjectGrid';
import { fetchAllGroupsThunk } from '../../store/group/group.thunks';
import GroupModal from '../../components/GroupModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import classes from './BoardPage.module.css';

function BoardPage() {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state) => state.groups.groups);

  useEffect(() => {
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  const grids = useMemo(
    () =>
      groups ? (
        groups.map((group, index) => (
          <ProjectGrid group={group} key={`project-grid-${index}`} />
        ))
      ) : (
        <></>
      ),
    [groups]
  );

  return (
    <Box className={classes.root}>
      <Container size='xl'>
        <header className={classes.head}>
          <div>
            <Title order={1} className={classes.title}>
              Workspaces
            </Title>
            <Text className={classes.note}>
              <TbClockHour4 aria-hidden />
              Free hosting: the first load after a quiet spell can take about 30
              seconds.
            </Text>
          </div>
          <GroupModal type='add' />
        </header>
        {groups?.length === 0 && (
          <Text className={classes.empty}>
            No workspaces yet. Make one to start adding projects.
          </Text>
        )}
        {grids}
      </Container>
    </Box>
  );
}

export default BoardPage;
