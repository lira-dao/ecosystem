import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CacheBuster from 'react-cache-buster';
import { router } from './router';
import theme from './theme';
import packageJson from '../package.json';


function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <CacheBuster
      currentVersion={packageJson.version}
      isEnabled={isProduction}
      isVerboseMode={false}
      loadingComponent={null}
    >
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </CacheBuster>
  );
}

export default App;
