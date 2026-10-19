import React from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  BoxProps,
  Box,
  SimpleGrid,
  Image,
} from '@mantine/core';
import { Link } from 'react-router';
import { TbCalendarTime, TbChecklist } from 'react-icons/tb';
import MacProject from '../../../assets/images/mac/mac-project.png';
import classes from './ViewSection.module.css';

const points = [
  {
    title: 'Consistently meet deadlines.',
    icon: TbCalendarTime,
    description:
      "From weekly sprints to yearly strategies, Timeline view ensures tasks stay on course. Easily preview upcoming milestones and spot any potential roadblocks hindering your team's advancement.",
  },
  {
    title: 'Stay in control of tasks.',
    icon: TbChecklist,
    description:
      'Navigate from weekly sprints to yearly plans seamlessly with Timeline view, ensuring all tasks stay on course. Get a quick overview of upcoming milestones and detect any potential gaps.',
  },
];

function ViewSection({ ...props }: BoxProps) {
  return (
    <Box className={classes.root} {...props}>
      <Container size='lg' py={{ base: 72, sm: 112 }}>
        <Stack align='center' gap='lg' mb={{ base: 40, sm: 56 }}>
          <Title ta='center' order={1} className={classes.title}>
            Experience work through a fresh lens.
          </Title>
          <Text ta='center' size='lg' c='gray.8' maw={640}>
            Gain comprehensive insights into your team's projects and approach
            tasks with a renewed perspective.
          </Text>
          <Button component={Link} size='md' to={'/views'} mt='xs'>
            Discover different views
          </Button>
        </Stack>

        <Image
          src={MacProject}
          alt='Agile Tasker project lists and cards on a MacBook'
          maw={960}
          mx='auto'
          loading='lazy'
          className={classes.device}
        />

        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 32, sm: 64 }}
          mt={{ base: 48, sm: 72 }}
          maw={960}
          mx='auto'
        >
          {points.map((point) => (
            <Box key={point.title}>
              <point.icon className={classes.icon} aria-hidden />
              <Title order={3} mb='xs'>
                {point.title}
              </Title>
              <Text c='gray.7'>{point.description}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default ViewSection;
