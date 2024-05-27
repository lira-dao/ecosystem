import React from 'react';
import { RouterProvider } from 'react-router-dom';
import packageJson from '../package.json';
import { router } from './router';
import CacheBuster from 'react-cache-buster';


function App() {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <CacheBuster
      currentVersion={packageJson.version}
      isEnabled={isProduction}
      isVerboseMode={false}
      loadingComponent={null}
    >
      <RouterProvider router={router} />
    </CacheBuster>
  );
}

export default App;
