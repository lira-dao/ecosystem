import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'react-responsive-modal/styles.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import { Web3Provider } from './components/Web3Provider';
import { GlobalStyles } from './theme/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { router } from './router';
import { Preflight } from '@xstyled/styled-components';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <GlobalStyles />
    <Preflight />
    <Web3Provider>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Web3Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
