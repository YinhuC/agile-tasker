import React from 'react';
import { Flex, Title, Text, Stack, FlexProps, TitleOrder } from '@mantine/core';
import classes from './ContentBlock.module.css';

type ContentBlockProps = FlexProps & {
  img: string;
  imgAlt?: string;
  title?: string;
  subtitle?: string;
  imageLeft?: boolean;
  imageTop?: boolean;
  imageSize?: string;
  titleOrder?: TitleOrder;
  titleWeight?: number;
  subtitleSize?: number;
};

function ContentBlock({
  title,
  subtitle,
  img,
  imgAlt = '',
  imageLeft = true,
  imageTop = true,
  imageSize = '100%',
  titleOrder = 1,
  titleWeight,
  subtitleSize,
  ...props
}: ContentBlockProps) {
  return (
    <Flex
      gap={{ base: 32, sm: 48 }}
      direction={{ base: 'column', sm: 'row' }}
      align='center'
      {...props}
    >
      <Stack
        justify='center'
        gap='sm'
        className={classes.text}
        style={{
          '--text-order': imageLeft ? 1 : 0,
          '--text-order-mobile': imageTop ? 1 : 0,
        }}
      >
        {title && (
          <Title order={titleOrder} fw={titleWeight} className={classes.title}>
            {title}
          </Title>
        )}
        {subtitle && (
          <Text fz={subtitleSize} c='gray.8' maw='62ch'>
            {subtitle}
          </Text>
        )}
      </Stack>

      <Flex
        className={classes.image}
        style={{
          '--image-order': imageLeft ? 0 : 1,
          '--image-order-mobile': imageTop ? 0 : 1,
          '--image-size': imageSize,
        }}
        justify='center'
      >
        <img src={img} alt={imgAlt} loading='lazy' decoding='async' />
      </Flex>
    </Flex>
  );
}

export default ContentBlock;
