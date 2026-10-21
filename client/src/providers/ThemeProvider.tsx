import React from 'react';
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';
import '@mantine/core/styles/UnstyledButton.css';
import '@mantine/core/styles/Paper.css';
import '@mantine/core/styles/CloseButton.css';
import '@mantine/core/styles/Group.css';
import '@mantine/core/styles/Loader.css';
import '@mantine/core/styles/Overlay.css';
import '@mantine/core/styles/ModalBase.css';
import '@mantine/core/styles/Input.css';
import '@mantine/core/styles/Flex.css';
import '@mantine/core/styles/ActionIcon.css';
import '@mantine/core/styles/Text.css';
import '@mantine/core/styles/Anchor.css';
import '@mantine/core/styles/Button.css';
import '@mantine/core/styles/Card.css';
import '@mantine/core/styles/Container.css';
import '@mantine/core/styles/Modal.css';
import '@mantine/core/styles/Notification.css';
import '@mantine/core/styles/PasswordInput.css';
import '@mantine/core/styles/SimpleGrid.css';
import '@mantine/core/styles/Title.css';
import '@mantine/notifications/styles.css';
import { CSSVariablesResolver, MantineProvider } from '@mantine/core';
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
      {children}
    </MantineProvider>
  );
}
