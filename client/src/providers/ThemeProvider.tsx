import React from 'react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { MotionConfig } from 'motion/react';
import theme from '../theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme='light'>
      <MotionConfig reducedMotion='user'>{children}</MotionConfig>
    </MantineProvider>
  );
}
