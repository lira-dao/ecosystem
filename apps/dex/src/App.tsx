import React from 'react';
import { RouterProvider } from 'react-router-dom';
import CacheBuster from 'react-cache-buster';
import { CssBaseline, GlobalStyles as MUIGlobalStyles, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Web3Provider } from './components/Web3Provider';
import { router } from './router';
import { muiDarkTheme } from './theme/theme';
import packageJson from '../package.json';

import ApercuMonoProBold from './theme/fonts/ApercuMonoProBold.ttf';
import ApercuMonoProMedium from './theme/fonts/ApercuMonoProMedium.ttf';
import ApercuMonoProRegular from './theme/fonts/ApercuMonoProRegular.ttf';
import ApercuMonoProLight from './theme/fonts/ApercuMonoProLight.ttf';
import AvenirNextBold from './theme/fonts/AvenirNextLTPro-Bold.otf';
import AvenirNextRegular from './theme/fonts/AvenirNextLTPro-Regular.otf';
import AvenirNextLite from './theme/fonts/AvenirNextLTPro-It.otf';


const GlobalStyles = () => (
  <MUIGlobalStyles
    styles={`
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
        src: url(${AvenirNextRegular}) format("opentype");
        font-weight: 500;
      }
      body {
        font-family: 'Apercu Mono Pro', Arial, sans-serif;
        min-height: 100vh;
        margin: 0;
        color: white;
        background-color: #0A0A0A;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      a,
      a:visited {
        color: #09FEF5;
        text-decoration: none;
      }
      *:focus,
      button:focus {
        outline: none;
      }
    `}
  />
);

export function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <CacheBuster
      currentVersion={packageJson.version}
      isEnabled={isProduction}
      isVerboseMode={false}
      loadingComponent={null}
      onCacheClear={() => {}}
    >
      <Web3Provider>
        <ThemeProvider theme={muiDarkTheme}>
          <CssBaseline />
          <GlobalStyles />
          <SnackbarProvider>
            <RouterProvider router={router} />
          </SnackbarProvider>
        </ThemeProvider>
      </Web3Provider>
    </CacheBuster>
  );
}
