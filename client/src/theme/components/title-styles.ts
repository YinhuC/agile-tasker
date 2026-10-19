import { MantineThemeOverride } from '@mantine/core';

export const sizes = {
  h1: {
    fontSize: 'clamp(2.5rem, 1.5rem + 3.4vw, 4.5rem)',
    lineHeight: '0.95',
  },
  h2: {
    fontSize: 'clamp(2rem, 1.4rem + 2vw, 3.25rem)',
    lineHeight: '1',
  },
  h3: {
    fontSize: '1.5rem',
    lineHeight: '1.1',
  },
  h4: {
    fontSize: '1.2rem',
    lineHeight: '1.2',
  },
  h5: {
    fontSize: '1rem',
    lineHeight: '1.25',
  },
  h6: {
    fontSize: '0.875rem',
    lineHeight: '1.3',
  },
} satisfies NonNullable<MantineThemeOverride['headings']>['sizes'];
