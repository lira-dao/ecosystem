import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Swap } from './pages/Swap';
import { Pool } from './pages/Pool';
import { AddLiquidity } from './pages/AddLiquidity';
import { RemoveLiquidity } from './pages/RemoveLiquidity';
import { Faucets } from './pages/Faucets';
import { Treasury } from './pages/Treasury';
import { TreasuryMint } from './pages/TreasuryMint';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Swap /> },
      { path: 'pool', element: <Pool /> },
      { path: 'swap', element: <Swap /> },
      { path: 'add-liquidity', element: <AddLiquidity /> },
      { path: 'treasury', element: <Treasury /> },
      { path: 'treasury/:address/:action', element: <TreasuryMint /> },
      { path: '/remove-liquidity/:address', element: <RemoveLiquidity /> },
      { path: 'faucets', element: <Faucets /> },
    ],
  },
]);
