import 'styled-components';
import '@xstyled/system';
import {
  ITheme,
  DefaultTheme as XStyledDefaultTheme,
} from '@xstyled/styled-components';

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
