import { Button, MantineThemeOverride } from '@mantine/core';
import classes from './button.module.css';

export const button: MantineThemeOverride['components'] = {
  Button: Button.extend({ classNames: classes }),
};
