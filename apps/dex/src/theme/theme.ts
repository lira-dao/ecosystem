import { defaultTheme } from '@xstyled/styled-components';
import { createTheme } from '@mui/material';


export const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  colors: {
    green: '#B6FE46',
    gray155: '#9B9B9B',
    white: '#FFFFFF'
  },
  typography: {
    fontFamily: [
      'Apercu Mono Pro',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontFamily: 'Avenir Next',
    },
    h2: {
      fontFamily: 'Avenir Next',
    },
    h3: {
      fontFamily: 'Avenir Next',
    }
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none'
        }
      }
    }
  }
});

export const theme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: '#B6FE46',
    secondary: '#09FEF5',
    gray34: '#222222',
    gray94: '#5E5E5E',
    gray155: '#9B9B9B',
    'eerie-black': '#1b1b1b',

    surface1: '#131313',
    surface2: '#1B1B1B',
    surface3: '#FFFFFF1F', //1F = 12%
    surface4: '#FFFFFF33', //33 = 20%
    surface5: '#0000000A', //0A = 4%

    'green-yellow-50': '#f7ffe5',
    'green-yellow-100': '#ecffc7',
    'green-yellow-200': '#d8ff95',
    'green-yellow-300': '#b6fe46',
    'green-yellow-400': '#a2f526',
    'green-yellow-500': '#82dc06',
    'green-yellow-600': '#63b000',
    'green-yellow-700': '#4b8506',
    'green-yellow-800': '#3e690b',
    'green-yellow-900': '#34580f',
    'green-yellow-950': '#193102',
    'aqua-50': '#edfffe',
    'aqua-100': '#c0fffe',
    'aqua-200': '#82fffd',
    'aqua-300': '#3bfffd',
    'aqua-400': '#09fef5',
    'aqua-500': '#00e1da',
    'aqua-600': '#00b6b4',
    'aqua-700': '#008f90',
    'aqua-800': '#006e71',
    'aqua-900': '#045b5d',
    'aqua-950': '#00373a',
  },
};
