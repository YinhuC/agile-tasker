import React from 'react';
import {
  Box,
  BoxProps,
  Container,
  Title,
  Text,
  SimpleGrid,
  Stack,
} from '@mantine/core';
import { TbPlugConnected, TbRobot, TbBuildingSkyscraper } from 'react-icons/tb';
import classes from './FeatureSection.module.css';

const features = [
  {
    title: 'Integrations',
    icon: TbPlugConnected,
    description:
      'Easily integrate the apps your team relies on into your Agile workflow or enhance it with a Power-Up tailored to your unique requirements.',
  },
  {
    title: 'Automation',
    icon: TbRobot,
    description:
      'Every Tasker board comes with built-in no-code automation. Concentrate on your most important tasks while letting the robots handle the rest.',
  },
  {
    title: 'Enterprise',
    icon: TbBuildingSkyscraper,
    description:
      'The beloved productivity tool for teams, equipped with the features and security essential for scalability.',
  },
];

function FeatureSection({ ...props }: BoxProps) {
  return (
    <Box className={classes.root} {...props}>
      <Container size='lg' py={{ base: 72, sm: 112 }}>
        <Stack gap='md' mb={{ base: 48, sm: 72 }} maw={720}>
          <Title order={1} c='white' className={classes.title}>
            Maximize your potential with Agile Tasker.
          </Title>
          <Text c='gray.4' size='lg'>
            Agile Tasker's intuitive features enable any team to swiftly
            establish and personalize workflows for virtually any task.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={{ base: 40, sm: 48 }}>
          {features.map((feature) => (
            <Box key={feature.title} className={classes.feature}>
              <feature.icon className={classes.icon} aria-hidden />
              <Title order={3} c='white' mb='xs'>
                {feature.title}
              </Title>
              <Text c='gray.4' size='sm'>
                {feature.description}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default FeatureSection;
