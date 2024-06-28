import { createTheme, ThemeOptions } from '@mui/material/styles';
import { TypographyOptions } from "@mui/material/styles/createTypography";

import ApercuMonoProBold from './fonts/ApercuMonoProBold.ttf';
import ApercuMonoProMedium from './fonts/ApercuMonoProMedium.ttf';
import ApercuMonoProRegular from './fonts/ApercuMonoProRegular.ttf';
import ApercuMonoProLight from './fonts/ApercuMonoProLight.ttf';
import AvenirNextBold from './fonts/AvenirNextLTPro-Bold.otf';
import AvenirNextRegular from './fonts/AvenirNextLTPro-Regular.otf';
import AvenirNextLite from './fonts/AvenirNextLTPro-It.otf';

import '@mui/material/styles';


declare module '@mui/material/styles' {
  interface TypographyVariants {
    xs: React.CSSProperties,
    sm: React.CSSProperties,
    base: React.CSSProperties,
    lg: React.CSSProperties,
    xl: React.CSSProperties,
    '2xl': React.CSSProperties,
    '3xl': React.CSSProperties,
    '4xl': React.CSSProperties,
    '5xl': React.CSSProperties,
    '6xl': React.CSSProperties,
    '7xl': React.CSSProperties,
    '8xl': React.CSSProperties,
    '9xl': React.CSSProperties,
  }

  interface TypographyVariantsOptions {
    xs: React.CSSProperties,
    sm: React.CSSProperties,
    base: React.CSSProperties,
    lg: React.CSSProperties,
    xl: React.CSSProperties,
    '2xl': React.CSSProperties,
    '3xl': React.CSSProperties,
    '4xl': React.CSSProperties,
    '5xl': React.CSSProperties,
    '6xl': React.CSSProperties,
    '7xl': React.CSSProperties,
    '8xl': React.CSSProperties,
    '9xl': React.CSSProperties,
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    xs: true,
    sm: true,
    base: true,
    lg: true,
    xl: true,
    '2xl': true,
    '3xl': true,
    '4xl': true,
    '5xl': true,
    '6xl': true,
    '7xl': true,
    '8xl': true,
    '9xl': true,
  }
}

interface ExtendedTypographyOptions extends TypographyOptions {
  xs: React.CSSProperties,
  sm: React.CSSProperties,
  base: React.CSSProperties,
  lg: React.CSSProperties,
  xl: React.CSSProperties,
  '2xl': React.CSSProperties,
  '3xl': React.CSSProperties,
  '4xl': React.CSSProperties,
  '5xl': React.CSSProperties,
  '6xl': React.CSSProperties,
  '7xl': React.CSSProperties,
  '8xl': React.CSSProperties,
  '9xl': React.CSSProperties,
}

export interface Colors {
  dark: string
  white: string
  'white-80': string
  primary: string
  secondary: string
  red: string
  emphasis: {
    high: string
    medium: string
    disabled: string
  },
  grays: {
    '50': string
    '100': string
    '200': string
    '300': string
    '400': string
    '500': string
    '600': string
    '700': string
    '800': string
    '900': string
  },
  horizontalGreenToCyan: string
  verticalGreenToTransparent: string
  verticalWhiteToTransparent: string
}

const colors: Colors = {
  dark: '#0A0A0A',
  white: '#FFFFFF',
  'white-80': 'rgba(255,255,255,0.8)',
  primary: '#B6FE46',
  secondary: '#09FEF5',
  red: '#fe092e',
  emphasis: {
    high: '#FFFFFF',
    medium: 'rgba(255, 255, 255, 0.8)',
    disabled: 'rgba(255, 255, 255, 0.38)',
  },
  grays: {
    '50': '#F8F9FA',
    '100': '#EBEDEF',
    '200': '#DDE1E4',
    '300': '#CED3D8',
    '400': '#BDC4CB',
    '500': '#AAB4BC',
    '600': '#95A1AC',
    '700': '#808A93',
    '800': '#646D74',
    '900': '#3B3F44',
  },
  horizontalGreenToCyan: 'linear-gradient(94.56deg, #B6FE46 7.15%, rgba(9, 254, 245, 0.6) 90.05%)',
  verticalGreenToTransparent: 'linear-gradient(180deg, rgba(182, 254, 70, 0.8) 0%, rgba(217, 217, 217, 0) 100%)',
  verticalWhiteToTransparent: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 7.41%, rgba(255, 255, 255, 0) 85.19%)',
};

const theme = createTheme({
  breakpoints: { 
    values: {
      xs: 0,     // 0em
      sm: 640,   // 40em
      md: 832,   // 52em
      lg: 1024,  // 64em
      xl: 1280   // 80em
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: "Apercu Mono Pro";
          src: url(${ApercuMonoProBold}) format("truetype");
          font-weight: 700;
        }

        @font-face {
          font-family: "Apercu Mono Pro";
          src: url(${ApercuMonoProMedium}) format("truetype");
          font-weight: 300;
        }

        @font-face {
          font-family: "Apercu Mono Pro";
          src: url(${ApercuMonoProRegular}) format("truetype");
          font-weight: 500;
        }

        @font-face {
          font-family: "Apercu Mono Pro";
          src: url(${ApercuMonoProLight}) format("truetype");
          font-weight: 400;
        }

        @font-face {
          font-family: "Avenir Next";
          src: url(${AvenirNextBold}) format("opentype");
          font-weight: 700;
        }

        @font-face {
          font-family: "Avenir Next";
          src: url(${AvenirNextRegular}) format("opentype");
          font-weight: 500;
        }

        @font-face {
          font-family: "Avenir Next";
          src: url(${AvenirNextLite}) format("opentype");
          font-weight: 400;
        }

        body {
          min-height: 100vh;
          margin: 0;
          color: white;
          background-color: #0A0A0A;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a, a:visited {
          color: #09FEF5;
          text-decoration: none;
        }

        *:focus,
        button:focus {
          outline: none;
        }
      `,
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none'
        }
      }
    }
  },
  palette: {
    mode: 'dark',
    common: {
      black: '#0A0A0A',
      white: '#FFFFFF'
    },
    primary: {
      main: '#B6FE46',
    },
    secondary: {
      main: '#09FEF5',
    },
    error: {
      main: '#fe092e',
    },
    grey: {
      50: '#F8F9FA',
      100: '#EBEDEF',
      200: '#DDE1E4',
      300: '#CED3D8',
      400: '#BDC4CB',
      500: '#AAB4BC',
      600: '#95A1AC',
      700: '#808A93',
      800: '#646D74',
      900: '#3B3F44',
    },
    background: {
      default: '#121212',
      paper: '#1D1D1D',
    },
    text: {
      primary: colors.white,
      secondary: colors['white-80'],
      disabled: 'rgba(255, 255, 255, 0.38)',
    },
    action: {
      hover: 'rgba(255, 255, 255, 0.08)',
      selected: 'rgba(255, 255, 255, 0.16)',
      disabled: 'rgba(255, 255, 255, 0.38)',
      disabledBackground: 'rgba(255, 255, 255, 0.12)',
    },
    horizontalGreenToCyan: 'linear-gradient(94.56deg, #B6FE46 7.15%, rgba(9, 254, 245, 0.6) 90.05%)',
    verticalGreenToTransparent: 'linear-gradient(180deg, rgba(182, 254, 70, 0.8) 0%, rgba(217, 217, 217, 0) 100%)',
    verticalWhiteToTransparent: 'linear-gradient(180deg, rgba(255, 255, 255, 0.8) 7.41%, rgba(255, 255, 255, 0) 85.19%)',
  },
  typography: {
    fontFamily: '"Apercu Mono Pro", "Avenir Next", sans-serif',
    h1: { fontSize: '104px', lineHeight: '116px' },
    h2: { fontSize: '96px', lineHeight: '116px' },
    h3: { fontSize: '75px', lineHeight: '108px' },
    h4: { fontSize: '48px', lineHeight: '72px' },
    h5: { fontSize: '40px', lineHeight: '60px' },
    h6: { fontSize: '32px', lineHeight: '48px' },
    button: { fontSize: '32px', lineHeight: '140px' },
    body1: { fontSize: '28px', lineHeight: '42px' },
    body2: { fontSize: '18px', lineHeight: '26px' },      // p
    subtitle1: { fontSize: '24px', lineHeight: '42px' },  // subtitle
    caption: { fontSize: '16px', lineHeight: '24px' },
    xs: { fontSize: '0.75rem', lineHeight: '1rem' },
    sm: { fontSize: '0.875rem', lineHeight: '1.25rem' },
    base: { fontSize: '1rem', lineHeight: '1.5rem' },
    lg: { fontSize: '1.125rem', lineHeight: '1.75rem' },
    xl: { fontSize: '1.25rem', lineHeight: '1.75rem' },
    '2xl': { fontSize: '1.5rem', lineHeight: '2rem' },
    '3xl': { fontSize: '1.875rem', lineHeight: '2.25rem', fontFamily: "Avenir Next" },
    '4xl': { fontSize: '2.25rem', lineHeight: '2.5rem' },
    '5xl': { fontSize: '3rem', lineHeight: '3rem', fontFamily: "Avenir Next" },
    '6xl': { fontSize: '3.75rem', lineHeight: '4rem' },
    '7xl': { fontSize: '4.5rem', lineHeight: '5.5rem', fontFamily: "Avenir Next" },
    '8xl': { fontSize: '5rem', lineHeight: '6.2rem', fontFamily: "Avenir Next" },
    '9xl': { fontSize: '6.5rem', lineHeight: '7.5rem', fontFamily: "Avenir Next" }
  } as ExtendedTypographyOptions,
} as ThemeOptions);

export default theme;