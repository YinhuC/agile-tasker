import React from 'react';
import { Box, BoxProps, Button, Container, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { TbCheck } from 'react-icons/tb';
import StockCard from '../../../components/StockCard';
import { reveal, rise, settle, stagger } from '../../../theme/motion';
import classes from './PricingSection.module.css';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    pitch: 'For personal lists and trying it out.',
    perks: [
      '3 workspaces',
      'Unlimited projects, lists and cards',
      'Drag and drop on every device',
    ],
    stock: 'white',
    action: 'Start for free',
  },
  {
    name: 'Pro',
    price: '$6',
    period: 'per month',
    pitch: 'For people running several projects at once.',
    perks: ['Everything in Free', 'Unlimited workspaces', 'Priority support'],
    stock: 'yellow',
    action: 'Start with Pro',
    featured: true,
  },
  {
    name: 'Team',
    price: '$12',
    period: 'per member, per month',
    pitch: 'For small teams sharing the same boards.',
    perks: ['Everything in Pro', 'Shared workspaces', 'Invite by email'],
    stock: 'blue',
    action: 'Start with Team',
  },
] as const;

/** Three plans printed on card stock; the featured plan is the yellow card. */
function PricingSection({ ...props }: BoxProps) {
  return (
    <Box id='pricing' className={classes.root} {...props}>
      <Container size='xl'>
        <motion.div className={classes.copy} {...reveal} variants={rise}>
          <Title order={2}>Simple pricing. Start free.</Title>
          <Text className={classes.lede}>
            Every plan gets the full board. Upgrade when you need more room.
          </Text>
        </motion.div>
        <motion.div
          className={classes.plans}
          {...reveal}
          variants={stagger(0.1)}
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={settle}>
              <StockCard
                stock={plan.stock}
                className={classes.plan}
                data-featured={'featured' in plan || undefined}
              >
                <div className={classes.head}>
                  <span className={classes.name}>{plan.name}</span>
                  {'featured' in plan && (
                    <span className={classes.tag}>Most popular</span>
                  )}
                </div>
                <div className={classes.price}>
                  {plan.price}
                  <span>{plan.period}</span>
                </div>
                <Text className={classes.pitch}>{plan.pitch}</Text>
                <ul className={classes.perks}>
                  {plan.perks.map((perk) => (
                    <li key={perk}>
                      <TbCheck aria-hidden />
                      {perk}
                    </li>
                  ))}
                </ul>
                <Button
                  component={Link}
                  to='/register'
                  variant={'featured' in plan ? 'ink' : 'outline'}
                  size='md'
                  fullWidth
                >
                  {plan.action}
                </Button>
              </StockCard>
            </motion.div>
          ))}
        </motion.div>
        <Text className={classes.footnote}>
          Prices in USD. Paid plans aren't on sale yet, so every account starts
          on Free.
        </Text>
      </Container>
    </Box>
  );
}

export default PricingSection;
