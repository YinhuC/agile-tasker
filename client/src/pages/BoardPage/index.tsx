import React, { useEffect, useMemo } from 'react';
import { Box, Container, Flex, Title, Text } from '@mantine/core';
import ProjectGrid from '../../components/ProjectGrid';
import { fetchAllGroupsThunk } from '../../store/group/group.thunks';
import GroupModal from '../../components/GroupModal';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';

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
    <Box py={30}>
      <Container size='xl'>
        <Flex
          justify='space-between'
          align='center'
          mb={20}
          mx={40}
          direction={{ base: 'column', md: 'row' }}
        >
          <Title order={2} mb={10}>
            Workspaces
          </Title>
          <Text ta='center' component='div'>
            <Text fw={900} mr={5}>
              Note:
            </Text>{' '}
            Due to our free tier hosting, delays will occur.
          </Text>
          <GroupModal type='add' />
        </Flex>
        {grids}
      </Container>
    </Box>
  );
}

export default BoardPage;
