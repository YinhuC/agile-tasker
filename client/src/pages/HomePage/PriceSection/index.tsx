import React from 'react';
import {
  Container,
  Stack,
  Title,
  Text,
  BoxProps,
  Box,
  Button,
  SimpleGrid,
} from '@mantine/core';
import { Link } from 'react-router';
import PriceCard from '../../../components/PriceCard';

function PriceSection({ ...props }: BoxProps) {
  return (
    <Box
      {...props}
      style={{
        background:
          'linear-gradient(180deg, var(--mantine-color-cyan-0) 0%, var(--mantine-color-cyan-1) 100%)',
      }}
      pt={80}
      pb={120}
    >
      <Container
        size='lg'
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Stack
          justify='center'
          align='center'
          w='100%'
          mx={10}
          mb={60}
        >
          <Title ta='center' order={1} fw={600}>
            Priced to fit your needs.
          </Title>
          <Text ta='center' mb={10} size='lg'>
            Millions trust Agile Tasker to empower teams globally.
          </Text>
          <Button size='md' component={Link} to='/plans'>
            Compare all plans
          </Button>
        </Stack>
        <SimpleGrid
          cols={{ base: 1, sm: 4 }}
          spacing={{ base: 20, sm: 0 }}
          verticalSpacing={{ base: 20, sm: 0 }}
          h='100%'
        >
          <PriceCard
            tier={'Free'}
            amount={0}
            amountDescription={'Free for your entire team.'}
            tierDescription={
              'For individuals or teams looking to organize any project.'
            }
            backgroundColor='var(--mantine-color-gray-0)'
            buttonText={'Try for free'}
          />
          <PriceCard
            tier={'Standard'}
            amount={10}
            amountDescription={
              'Per user per month when billed annually ($12 when billed monthly).'
            }
            tierDescription={
              'For small teams seeking to manage tasks and expand collaboration.'
            }
            backgroundColor='var(--mantine-color-gray-0)'
            buttonText={'Sign up now'}
          />

          <PriceCard
            tier={'Premium'}
            amount={20}
            amountDescription={
              'Per user per month when billed annually ($24 when billed monthly).'
            }
            tierDescription={
              'For teams requiring comprehensive project tracking and visualization across various formats like boards, timelines, calendars, and more.'
            }
            backgroundColor='var(--mantine-color-gray-0)'
            buttonText={'Get started now'}
            highlight={true}
          />
          <PriceCard
            tier={'Enterprise'}
            amount={30}
            amountDescription={
              'Per user per month when billed annually ($39 when billed monthly).'
            }
            tierDescription={
              'For organizations necessitating secure and controlled connectivity of work across multiple teams.'
            }
            backgroundColor='var(--mantine-color-gray-0)'
            buttonText={'Contact sales'}
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default PriceSection;
