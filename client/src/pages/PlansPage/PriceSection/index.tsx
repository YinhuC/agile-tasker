import React from 'react';
import {
  Container,
  Box,
  Title,
  Stack,
  Text,
  SimpleGrid,
  List,
} from '@mantine/core';
import { FaCheck } from 'react-icons/fa';
import PriceCard from '../../../components/PriceCard';
import classes from './PriceSection.module.css';

const tiers = [
  {
    tier: 'Free',
    amount: 0,
    amountDescription: 'Free for your entire team.',
    tierDescription:
      'For individuals or teams looking to organize any project.',
    buttonText: 'Try for free',
    to: '/register',
    featuresTitle: 'Included in free:',
    features: [
      'Unlimited cards',
      'Up to 10 boards per Workspace',
      'Unlimited Power-Ups per board',
      'Unlimited storage (10MB/file)',
      '250 Workspace command runs per month',
      'Custom backgrounds & stickers',
      'Unlimited activity log',
      'Assignee and due dates',
      'iOS and Android mobile apps',
      '2-factor authentication',
    ],
  },
  {
    tier: 'Standard',
    amount: 10,
    amountDescription:
      'Per user per month when billed annually ($12 when billed monthly).',
    tierDescription:
      'For small teams seeking to manage tasks and expand collaboration.',
    buttonText: 'Sign up now',
    to: '/register',
    featuresTitle: 'Everything in free, plus:',
    features: [
      'Unlimited boards',
      'Advanced checklists',
      'Custom Fields',
      'Unlimited storage (250MB/file)',
      '1,000 Workspace command runs per month',
      'Single board guests',
      'Saved searches',
    ],
  },
  {
    tier: 'Premium',
    amount: 20,
    amountDescription:
      'Per user per month when billed annually ($24 when billed monthly).',
    tierDescription:
      'For teams requiring comprehensive project tracking and visualization across various formats like boards, timelines, calendars, and more.',
    buttonText: 'Get started now',
    to: '/register',
    highlight: true,
    featuresTitle: 'Everything in standard, plus:',
    features: [
      'Views: Calendar, Timeline, Table, Dashboard, and Map',
      'Workspace views: Table and Calendar',
      'Unlimited Workspace command runs',
      'Agile Intelligence (AI)',
      'Admin and security features',
      'Workspace-level templates',
      'Collections',
      'Observers',
      'Simple data export',
    ],
  },
  {
    tier: 'Enterprise',
    amount: 30,
    amountDescription:
      'Per user per month when billed annually ($39 when billed monthly).',
    tierDescription:
      'For organizations necessitating secure and controlled connectivity of work across multiple teams.',
    buttonText: 'Contact sales',
    featuresTitle: 'Everything in premium, plus:',
    features: [
      'Unlimited Workspaces',
      'Organization-wide permissions',
      'Organization-visible boards',
      'Public board management',
      'Multi-board guests',
      'Attachment permissions',
      'Power-Up administration',
      'Free SSO and user provisioning with Agile Access',
    ],
  },
];

function PriceSection() {
  return (
    <>
      <Box className={classes.hero}>
        <Container
          size='lg'
          pt={{ base: 64, sm: 96 }}
          pb={{ base: 40, sm: 56 }}
        >
          <Stack align='center' gap='lg'>
            <Title order={1} ta='center' className={classes.title}>
              Agile Tasker, tailored to you.
            </Title>
            <Text ta='center' size='lg' c='gray.8' maw={640}>
              Trusted by millions worldwide, Agile Tasker empowers teams across
              the globe. Explore the options to find the perfect fit for you.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size='lg' pb={{ base: 72, sm: 112 }}>
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 4 }}
          spacing='lg'
          verticalSpacing='lg'
        >
          {tiers.map(({ featuresTitle, features, ...tier }) => (
            <PriceCard key={tier.tier} {...tier}>
              <Text
                tt='uppercase'
                mb='sm'
                size='xs'
                fw={700}
                lts='0.06em'
                c='gray.7'
              >
                {featuresTitle}
              </Text>
              <List
                spacing={8}
                size='sm'
                icon={<FaCheck className={classes.check} aria-hidden />}
                classNames={{ itemWrapper: classes.itemWrapper }}
              >
                {features.map((feature) => (
                  <List.Item key={feature}>{feature}</List.Item>
                ))}
              </List>
            </PriceCard>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

export default PriceSection;
