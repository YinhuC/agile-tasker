import { createTheme } from '@mantine/core';
import { sizes } from './components/title-styles';
import { inputs } from './components/input-styles';
import { button } from './components/button-styles';

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
  fontFamily: 'Inter, Arial, Helvetica, sans-serif',
  lineHeights: {
    xs: '1.2',
    sm: '1.2',
    md: '1.2',
    lg: '1.2',
    xl: '1.2',
  },
  primaryColor: 'pink',
  defaultRadius: 'sm',
  headings: {
    fontFamily: 'Playfair Display, Gerigia, serif',
    sizes: sizes,
    fontWeight: '400',
  },
  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  },
  components: {
    ...inputs,
    ...button,
  },
});

export default projectTheme;
