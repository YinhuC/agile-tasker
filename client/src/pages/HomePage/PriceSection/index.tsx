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
    <Box {...props} py={{ base: 72, sm: 112 }}>
      <Container size='lg'>
        <Stack align='center' gap='lg' mb={{ base: 40, sm: 56 }}>
          <Title ta='center' order={1} fw={600}>
            Priced to fit your needs.
          </Title>
          <Text ta='center' size='lg' c='gray.8'>
            Millions trust Agile Tasker to empower teams globally.
          </Text>
          <Button size='md' mt='xs' component={Link} to='/plans'>
            Compare all plans
          </Button>
        </Stack>
        <SimpleGrid
          cols={{ base: 1, xs: 2, md: 4 }}
          spacing='lg'
          verticalSpacing='lg'
        >
          <PriceCard
            tier={'Free'}
            amount={0}
            amountDescription={'Free for your entire team.'}
            tierDescription={
              'For individuals or teams looking to organize any project.'
            }
            buttonText={'Try for free'}
            to='/register'
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
            buttonText={'Sign up now'}
            to='/register'
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
            buttonText={'Get started now'}
            to='/register'
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
            buttonText={'Contact sales'}
          />
        </SimpleGrid>
      </Container>
    </Box>
  );
}

export default PriceSection;
