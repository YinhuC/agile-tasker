import React from 'react';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { CSSVariablesResolver, MantineProvider } from '@mantine/core';
import { MotionConfig } from 'motion/react';
import theme from '../theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const resolver: CSSVariablesResolver = (current) => ({
  variables: {},
  light: {
    '--mantine-color-body': current.colors.steel[1],
    '--mantine-color-text': current.colors.dark[8],
    '--mantine-color-dimmed': current.colors.steel[8],
  },
  dark: {},
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider
      theme={theme}
      defaultColorScheme='light'
      cssVariablesResolver={resolver}
    >
      <MotionConfig reducedMotion='user'>{children}</MotionConfig>
    </MantineProvider>
  );
}
