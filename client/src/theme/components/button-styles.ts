import { MantineThemeOverride } from '@mantine/core';

export const button: MantineThemeOverride['components'] = {
  Button: {
    styles: (theme) => ({
      root: {},
    }),
    variants: {
      light: (theme) => ({
        root: {
          backgroundColor: theme.colors.pink[0],
          color: theme.colors.pink[7],
          '&:hover': {
            backgroundColor: `${theme.colors.pink[1]} !important`,
          },
        },
      }),
    },
  },
};
