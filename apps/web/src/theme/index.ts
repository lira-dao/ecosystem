export interface FontSizes {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  button: string;
  body: string;
  subtitle: string;
  p: string;
  caption: string;

  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
}

export interface LineHeights {
  h1: string;
  h2: string;
  h3: string;
  h4: string;
  h5: string;
  h6: string;
  button: string;
  body: string;
  subtitle: string;
  p: string;
  caption: string;

  xs: string;
  sm: string;
  base: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
  '5xl': string;
  '6xl': string;
  '7xl': string;
  '8xl': string;
  '9xl': string;
}

export interface FontFamilies {
  primary: string;
  secondary: string;
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

export interface Theme {
  fontSizes: FontSizes,
  fontFamilies: FontFamilies,
  lineHeights: LineHeights,
  colors: Colors,
}

const fontSizes: FontSizes = {
  h1: '104px',
  h2: '96px',
  h3: '75px',
  h4: '48px',
  h5: '40px',
  h6: '32px',
  button: '32px',
  body: '28px',
  subtitle: '24px',
  p: '18px',
  caption: '16px',

  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '5rem',
  '9xl': '8rem',
};

const lineHeights: LineHeights = {
  h1: '116px',
  h2: '116px',
  h3: '108px',
  h4: '72px',
  h5: '60px',
  h6: '48px',
  button: '140px',
  body: '42px',
  subtitle: '42px',
  p: '26px',
  caption: '24px',

  xs: '1rem',
  sm: '1.25rem',
  base: '1.5rem',
  lg: '1.75rem',
  xl: '1.75rem',
  '2xl': '2rem',
  '3xl': '2.25rem',
  '4xl': '2.5rem',
  '5xl': '1rem',
  '6xl': '1rem',
  '7xl': '1rem',
  '8xl': '1rem',
  '9xl': '1rem',
};

const fontFamilies: FontFamilies = {
  primary: 'Apercu Mono Pro',
  secondary: 'Avenir Next',
};

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

const theme = {
  fontSizes,
  lineHeights,
  fontFamilies,
  colors,
};

export default theme;
