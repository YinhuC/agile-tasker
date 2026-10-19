import React from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  BoxProps,
  Box,
  Card,
} from '@mantine/core';
import { Link } from 'react-router';
import Task from '../../../assets/images/checklist.png';
import Deadline from '../../../assets/images/time.png';
import ContentBlock from '../../../components/ContentBlock';

function ViewSection({ ...props }: BoxProps) {
  return (
    <Box
      mah={{ base: 1300, sm: 800, md: 850, lg: 950 }}
      style={{
        background:
          'linear-gradient(90deg, var(--mantine-color-blue-9) 0%, var(--mantine-color-cyan-5) 100%)',
      }}
      {...props}
    >
      <Container
        size='lg'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
        pt={50}
      >
        <Stack justify='center' align='center' w='100%' mx={10}>
          <Title ta='center' order={1} c='white' fw={600}>
            Experience work through a fresh lens.
          </Title>
          <Text ta='center' mb={10} size='lg' c='white'>
            Gain comprehensive insights into your team's projects and approach
            tasks with a renewed perspective.
          </Text>
          <Button
            component={Link}
            size='md'
            mr='0.5rem'
            to={'/views'}
            aria-label='Discover different views'
            variant='light'
            mb={40}
          >
            Discover different views
          </Button>

          <Card
            shadow='md'
            py={30}
            px={10}
            radius='md'
            withBorder
            mb={50}
            maw={{ base: 500, sm: 'none' }}
          >
            <ContentBlock
              title={'Consistently meet deadlines.'}
              subtitle={`From weekly sprints to yearly strategies, Timeline view ensures tasks stay on course. 
              Easily preview upcoming milestones and spot any potential roadblocks hindering your team's advancement.`}
              img={Deadline}
              imageSize='80%'
              titleOrder={3}
              titleWeight={500}
            />
          </Card>

          <Card
            shadow='md'
            py={30}
            px={10}
            radius='md'
            withBorder
            maw={{ base: 500, sm: 'none' }}
          >
            <ContentBlock
              title={'Stay in control of tasks.'}
              subtitle={`Navigate from weekly sprints to yearly plans seamlessly with Timeline view, ensuring all tasks stay on course. 
              Get a quick overview of upcoming milestones and detect any potential gaps.`}
              img={Task}
              imageLeft={false}
              imageSize='80%'
              titleOrder={3}
              titleWeight={500}
            />
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}

export default ViewSection;
