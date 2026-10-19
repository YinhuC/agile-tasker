import { ActionIcon, Button, MantineThemeOverride } from '@mantine/core';
import classes from './button.module.css';

const INK = 'var(--mantine-color-dark-8)';

/** Ink defaults for the tag variants; an explicit `color` keeps Mantine's own resolution. */
const variantVars: Record<string, Record<string, string>> = {
  ink: {
    '--button-bg': INK,
    '--button-hover': 'var(--mantine-color-dark-6)',
    '--button-color': 'var(--mantine-color-stock-5)',
    '--button-bd': '0',
  },
  outline: {
    '--button-bg': 'transparent',
    '--button-hover': 'rgba(22, 24, 26, 0.07)',
    '--button-color': INK,
    '--button-bd': `2px solid ${INK}`,
  },
  light: {
    '--button-bg': 'var(--mantine-color-white)',
    '--button-hover': 'var(--mantine-color-stock-0)',
    '--button-color': INK,
    '--button-bd': `1.5px solid ${INK}`,
  },
  subtle: {
    '--button-bg': 'transparent',
    '--button-hover': 'rgba(22, 24, 26, 0.07)',
    '--button-color': 'var(--mantine-color-dark-6)',
    '--button-bd': '0',
  },
};

export const button: MantineThemeOverride['components'] = {
  Button: Button.extend({
    classNames: classes,
    vars: (_theme, props) => {
      const vars = props.color ? undefined : variantVars[props.variant ?? ''];
      return { root: vars ?? {} };
    },
  }),
  ActionIcon: ActionIcon.extend({
    defaultProps: { radius: 'xl', variant: 'subtle', color: 'dark' },
  }),
};
