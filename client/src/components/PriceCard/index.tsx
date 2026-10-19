import React from 'react';
import { Text, Button, Card, CardProps } from '@mantine/core';

type PriceCardProps = Omit<CardProps, 'children'> & {
  tier: string;
  amount: number;
  amountDescription: string;
  tierDescription: string;
  buttonText: string;
  highlight?: boolean;
  backgroundColor?: string;
};

function PriceCard({
  tier,
  amount,
  amountDescription,
  tierDescription,
  buttonText,
  highlight = false,
  backgroundColor = 'transparent',
  ...props
}: PriceCardProps) {
  return (
    <Card
      radius={0}
      h={{ base: 'auto', sm: '100%' }}
      mih={{ base: 450, sm: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: backgroundColor,
        border: highlight
          ? '0.125rem solid var(--mantine-color-pink-3)'
          : '0.0625rem solid #dee2e6',
      }}
      {...props}
    >
      <Text tt='uppercase' fw={700} mb={30} mt={20}>
        {tier}
      </Text>
      <Text fz={36} mb={5}>
        ${amount} USD
      </Text>
      <Text c='dimmed' size='xs' mb={40} h={28.8}>
        {amountDescription}
      </Text>
      <Text mb={80}>{tierDescription}</Text>
      <Button mt='auto' variant='outline'>
        {buttonText}
      </Button>
    </Card>
  );
}

export default PriceCard;
