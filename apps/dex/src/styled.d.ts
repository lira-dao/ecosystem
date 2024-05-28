import 'styled-components';
import '@xstyled/system';
import { DefaultTheme as XStyledDefaultTheme, ITheme } from '@xstyled/styled-components';

interface AppTheme extends ITheme, XStyledDefaultTheme {
  colors: {
    primary: string,
    secondary: string,
    gray34: string,
    gray94: string,
    gray155: string,
    'eerie-black': string,
    'aqua-900': string
    'green-yellow-300': string,
    'green-yellow-600': string,
    'green-yellow-700': string,
    'green-yellow-800': string,
    'green-yellow-900': string,
    'green-yellow-950': string,
    'red-50': string;
    'red-100': string;
    'red-200': string;
    'red-300': string;
    'red-400': string;
    'red-500': string;
    'red-600': string;
    'red-700': string;
    'red-800': string;
    'red-900': string;
  };
}

declare module '@xstyled/system' {
  export interface Theme extends AppTheme {
  }
}
declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {
  }
}
