import React, { PropsWithChildren } from 'react';
import { Box, Image, Text, Title } from '@mantine/core';
import { Link } from 'react-router';
import LogoDark from '../../assets/logos/logo-dark.png';
import marketing from '../../theme/styles/marketing.module.css';
import classes from './AuthLayout.module.css';

type AuthLayoutProps = PropsWithChildren & {
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  footer: React.ReactNode;
};

/** Split auth screen: form column on the left, phone screenshot on the hero gradient from md up. */
function AuthLayout({
  title,
  subtitle,
  image,
  imageAlt,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <Box className={`${marketing.page} ${classes.root}`}>
      <Box className={classes.formSide}>
        <Link to={'/'} className={classes.logoLink}>
          <Image
            src={LogoDark}
            alt='agile-tasker home'
            className={classes.logo}
          />
        </Link>
        <Box className={classes.form}>
          <Title order={1} className={classes.title}>
            {title}
          </Title>
          <Text c='gray.7' mt='sm' mb={40}>
            {subtitle}
          </Text>
          {children}
          <Text size='sm' mt={32} c='gray.7' className={classes.footer}>
            {footer}
          </Text>
        </Box>
      </Box>
      <Box className={classes.visual} visibleFrom='md'>
        <img src={image} alt={imageAlt} className={classes.phone} />
      </Box>
    </Box>
  );
}

export default AuthLayout;
