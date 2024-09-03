import { createTheme } from '@mui/material';

import ApercuMonoProBold from './fonts/ApercuMonoProBold.ttf';
import ApercuMonoProMedium from './fonts/ApercuMonoProMedium.ttf';
import ApercuMonoProRegular from './fonts/ApercuMonoProRegular.ttf';
import ApercuMonoProLight from './fonts/ApercuMonoProLight.ttf';
import AvenirNextBold from './fonts/AvenirNextLTPro-Bold.otf';
import AvenirNextRegular from './fonts/AvenirNextLTPro-Regular.otf';
import AvenirNextLite from './fonts/AvenirNextLTPro-It.otf';

export const green = {
  50: '#f7ffe5',
  100: '#ecffc7',
  200: '#d8ff95',
  300: '#b6fe46',
  400: '#a2f526',
  500: '#82dc06',
  600: '#63b000',
  700: '#4b8506',
  800: '#3e690b',
  900: '#34580f',
  950: '#193102',
};

export const cyan = {
  50: '#edfffe',
  100: '#c0fffe',
  200: '#82fffd',
  300: '#3bfffd',
  400: '#09fef5',
  500: '#00e1da',
  600: '#00b6b4',
  700: '#008f90',
  800: '#006e71',
  900: '#045b5d',
  950: '#00373a',
};

export const muiDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF',
    },
    secondary: {
      main: '#09FEF5',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9B9B9B',
    },
    background: {
      default: '#1b1b1b',
      paper: '#1b1b1b',
    },
  },
  colors: {
    gray155: '#9B9B9B',
    white: '#FFFFFF',
    cyan,
    green,
    red400: '#fe092e',
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
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': [
          {
            fontFamily: "Apercu Mono Pro",
            src: `url(${ApercuMonoProBold}) format("truetype")`,
            fontWeight: 700,
          },
          {
            fontFamily: "Apercu Mono Pro",
            src: `url(${ApercuMonoProMedium}) format("truetype")`,
            fontWeight: 300,
          },
          {
            fontFamily: "Apercu Mono Pro",
            src: `url(${ApercuMonoProRegular}) format("truetype")`,
            fontWeight: 500,
          },
          {
            fontFamily: "Apercu Mono Pro",
            src: `url(${ApercuMonoProLight}) format("truetype")`,
            fontWeight: 400,
          },
          {
            fontFamily: "Avenir Next",
            src: `url(${AvenirNextRegular}) format("opentype")`,
            fontWeight: 500,
          },
        ],
        body: {
          fontFamily: 'Apercu Mono Pro, Arial, sans-serif',
          minHeight: '100vh',
          margin: 0,
          color: 'white',
          // backgroundColor: '#0A0A0A',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
        a: {
          color: '#09FEF5',
          textDecoration: 'none',
        },
        'a:visited': {
          color: '#09FEF5',
          textDecoration: 'none',
        },
        '*:focus': {
          outline: 'none',
        },
        'button:focus': {
          outline: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: 'none',
          },
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#9B9B9B',
            },
            '&:hover fieldset': {
              borderColor: 'white',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'white',
            },
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: 'none',
          },
          '&:focus': {
            outline: 'none',
            boxShadow: 'none',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
