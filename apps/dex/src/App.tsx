import React from 'react';
import packageJson from '../package.json';
import CacheBuster from 'react-cache-buster';
import { GlobalStyles } from './theme/GlobalStyles';
import { Preflight } from '@xstyled/styled-components';
import { Web3Provider } from './components/Web3Provider';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { SnackbarProvider } from 'notistack';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';


export function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <CacheBuster
      currentVersion={packageJson.version}
      isEnabled={isProduction}
      isVerboseMode={false}
      loadingComponent={null}
    >
      <>
        <GlobalStyles />
        <Preflight />
        <Web3Provider>
          <ThemeProvider theme={theme}>
            <SnackbarProvider>
              <RouterProvider router={router} />
            </SnackbarProvider>
          </ThemeProvider>
        </Web3Provider>
      </>
    </CacheBuster>
  );
}
