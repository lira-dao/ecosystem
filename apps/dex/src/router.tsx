import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Treasury } from './pages/Treasury';
import { Swap } from './pages/Swap';
import { Faucets } from './pages/Faucets';
import { Pool } from './pages/Pool';
import { AddLiquidity } from './pages/AddLiquidity';
import { RemoveLiquidity } from './pages/RemoveLiquidity';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Swap /> },
      { path: 'treasury', element: <Treasury /> },
      { path: 'pool', element: <Pool /> },
      { path: 'swap', element: <Swap /> },
      // { path: 'faucets', element: <Faucets /> },
      { path: 'add-liquidity', element: <AddLiquidity /> },
      { path: '/remove-liquidity/:address', element: <RemoveLiquidity /> },
    ],
  },
]);
