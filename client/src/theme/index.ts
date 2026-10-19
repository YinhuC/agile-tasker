import { createTheme } from '@mantine/core';
import { sizes } from './components/title-styles';
import { inputs } from './components/input-styles';
import { button } from './components/button-styles';
import { surfaces } from './components/surface-styles';
import { ink, signal, sleeve, steel, stock } from './colors';

import './styles/fonts.css';
import './styles/body.css';

const projectTheme = createTheme({
  breakpoints: {
    xxs: '24em',
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
  colors: { stock, steel, sleeve, signal, dark: ink },
  primaryColor: 'stock',
  primaryShade: 5,
  autoContrast: true,
  luminanceThreshold: 0.45,
  black: ink[8],
  white: '#fbfbf8',
  fontFamily: 'Archivo, "Helvetica Neue", Arial, sans-serif',
  fontFamilyMonospace: '"Martian Mono", ui-monospace, monospace',
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.55',
    lg: '1.5',
    xl: '1.45',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '19px',
    xl: '23px',
  },
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
  },
  defaultRadius: 'sm',
  shadows: {
    xs: '0 1px 2px rgba(22, 24, 26, 0.12)',
    sm: '0 2px 4px -1px rgba(22, 24, 26, 0.14), 0 6px 12px -6px rgba(22, 24, 26, 0.18)',
    md: '0 4px 8px -2px rgba(22, 24, 26, 0.14), 0 18px 32px -16px rgba(22, 24, 26, 0.32)',
    lg: '0 8px 16px -4px rgba(22, 24, 26, 0.16), 0 32px 56px -24px rgba(22, 24, 26, 0.42)',
    xl: '0 12px 24px -6px rgba(22, 24, 26, 0.18), 0 48px 80px -32px rgba(22, 24, 26, 0.5)',
  },
  headings: {
    fontFamily: 'Archivo, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '800',
    textWrap: 'balance',
    sizes,
  },
  components: {
    ...inputs,
    ...button,
    ...surfaces,
  },
});

export default projectTheme;
