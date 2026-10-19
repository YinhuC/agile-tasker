import React, { useState } from 'react';
import {
  Flex,
  Title,
  Text,
  Stack,
  Skeleton,
  FlexProps,
  TitleOrder,
} from '@mantine/core';
import { motion } from 'motion/react';
import classes from './ContentBlock.module.css';

type ContentBlockProps = FlexProps & {
  img: string;
  text?: string;
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
  text,
  title,
  subtitle,
  img,
  imageLeft = true,
  imageTop = true,
  imageSize = '100%',
  titleOrder = 1,
  titleWeight,
  subtitleSize,
  ...props
}: ContentBlockProps) {
  const [loading, setLoading] = useState(true);
  return (
    <Flex
      gap={30}
      direction={{ base: 'column', sm: 'row' }}
      align={{ base: 'center', sm: 'stretch' }}
      {...props}
    >
      <Stack
        justify='center'
        gap={5}
        mx={20}
        className={classes.text}
        style={{
          '--text-order': imageLeft ? 1 : 0,
          '--text-order-mobile': imageTop ? 1 : 0,
        }}
      >
        {text && (
          <Text tt='uppercase' fw={700}>
            {text}
          </Text>
        )}
        {title && (
          <Title order={titleOrder} mb={10} fw={titleWeight}>
            {title}
          </Title>
        )}
        {subtitle && (
          <Text lh='160%' mb={20} fz={subtitleSize}>
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
        <Skeleton
          width={(window.innerWidth / 100) * 40}
          radius={12}
          height={(window.innerHeight / 100) * 50}
          display={loading ? 'block' : 'none'}
        />
        <motion.img
          src={img}
          alt='agile tasker on mobile'
          style={{
            display: loading ? 'none' : 'block',
          }}
          onLoad={() => setLoading(false)}
        />
      </Flex>
    </Flex>
  );
}

export default ContentBlock;
