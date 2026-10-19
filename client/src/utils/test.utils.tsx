import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import theme from '../theme';

export function MantineWrapper({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme} env='test'>
      {children}
    </MantineProvider>
  );
}

export function renderWithMantine(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return render(ui, { wrapper: MantineWrapper, ...options });
}
