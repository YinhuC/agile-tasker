import React from 'react';
import { Text, Button, Card, CardProps, Group, Divider } from '@mantine/core';
import { Link } from 'react-router';
import { childRoot } from '../../theme/motion';
import classes from './PriceCard.module.css';

type PriceCardProps = Omit<CardProps, 'children'> & {
  tier: string;
  amount: number;
  amountDescription: string;
  tierDescription: string;
  buttonText: string;
  to?: string;
  highlight?: boolean;
  backgroundColor?: string;
  children?: React.ReactNode;
};

/** Pricing tier card; rows sit on a subgrid so sibling cards align row by row. */
function PriceCard({
  tier,
  amount,
  amountDescription,
  tierDescription,
  buttonText,
  to,
  highlight = false,
  backgroundColor = 'var(--mantine-color-white)',
  children,
  ...props
}: PriceCardProps) {
  return (
    <Card
      radius='md'
      padding='lg'
      withBorder
      className={classes.root}
      data-highlight={highlight || undefined}
      style={{ backgroundColor, gridRow: `span ${children ? 5 : 4}` }}
      renderRoot={childRoot()}
      {...props}
    >
      <Text
        tt='uppercase'
        fw={700}
        size='sm'
        lts='0.06em'
        c={highlight ? 'pink.7' : undefined}
      >
        {tier}
      </Text>
      <div>
        <Group gap={6} align='baseline'>
          <Text fz={40} fw={600} lh={1}>
            ${amount}
          </Text>
          <Text c='dimmed' size='sm'>
            USD
          </Text>
        </Group>
        <Text c='gray.7' size='xs' mt={8}>
          {amountDescription}
        </Text>
      </div>
      <Text size='sm'>{tierDescription}</Text>
      {to ? (
        <Button
          component={Link}
          to={to}
          variant={highlight ? 'filled' : 'outline'}
        >
          {buttonText}
        </Button>
      ) : (
        <Button variant={highlight ? 'filled' : 'outline'}>{buttonText}</Button>
      )}
      {children && (
        <div>
          <Divider mb='lg' />
          {children}
        </div>
      )}
    </Card>
  );
}

export default PriceCard;
