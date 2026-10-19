import React, { PropsWithChildren } from 'react';
import { Box, Text, Title } from '@mantine/core';
import { motion } from 'motion/react';
import StockCard from '../StockCard';
import Wordmark from '../Wordmark';
import { enter, rise, settle, stagger } from '../../theme/motion';
import classes from './AuthLayout.module.css';

type AuthLayoutProps = PropsWithChildren & {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  footer: React.ReactNode;
};

/** Auth screen on the steel rack: the form is a white printed card, the phone shot sits in a sleeve from md up. */
function AuthLayout({
  title,
  subtitle,
  image,
  imageAlt,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <motion.div className={classes.root} {...enter} variants={stagger(0.12)}>
      <Box className={classes.formSide}>
        <Wordmark to='/' size={24} />
        <motion.div className={classes.formSlot} variants={rise}>
          <StockCard stock='white' className={classes.card}>
            <div className={classes.head}>
              <Title order={1} className={classes.title}>
                {title}
              </Title>
              <Text className={classes.subtitle}>{subtitle}</Text>
            </div>
            {children}
            <Text size='sm' className={classes.footer}>
              {footer}
            </Text>
          </StockCard>
        </motion.div>
      </Box>
      <Box className={classes.visual} visibleFrom='md'>
        <motion.div className={classes.sleeve} variants={settle}>
          <img src={image} alt={imageAlt} className={classes.phone} />
        </motion.div>
      </Box>
    </motion.div>
  );
}

export default AuthLayout;
