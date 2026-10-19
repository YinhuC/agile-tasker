import { MantineThemeOverride } from '@mantine/core';

export const sizes = {
  h1: {
    fontSize: '2.5rem',
    lineHeight: '1.2',
  },
  h2: {
    fontSize: '2rem',
    lineHeight: '1.2',
  },
  h3: {
    fontSize: '1.5rem',
    lineHeight: '1.2',
  },
  h4: {
    fontSize: '1.25rem',
    lineHeight: '1.2',
  },
  h5: {
    fontSize: '1rem',
    lineHeight: '1.2',
  },
  h6: {
    fontSize: '0.875rem',
    lineHeight: '1.2',
  },
} satisfies NonNullable<MantineThemeOverride['headings']>['sizes'];
