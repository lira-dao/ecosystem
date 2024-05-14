import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Treasury } from './pages/Treasury';
import { Swap } from './pages/Swap';
import { Faucets } from './pages/Faucets';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Faucets /> },
      { path: 'treasury', element: <Treasury /> },
      { path: 'swap', element: <Swap /> },
      { path: 'faucets', element: <Faucets /> },
    ],
  },
]);
