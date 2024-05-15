import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Web3Provider } from './components/Web3Provider';


function App() {
  return (
    <Web3Provider>
      <RouterProvider router={router} />
    </Web3Provider>
  );
}

export default App;
