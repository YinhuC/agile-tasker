import {
  MantineThemeOverride,
  PasswordInput,
  Textarea,
  TextInput,
} from '@mantine/core';
import classes from './input.module.css';

export const inputs: MantineThemeOverride['components'] = {
  TextInput: TextInput.extend({ classNames: classes }),
  PasswordInput: PasswordInput.extend({ classNames: classes }),
  Textarea: Textarea.extend({ classNames: classes }),
};
