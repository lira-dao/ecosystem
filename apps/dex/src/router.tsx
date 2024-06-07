import { createBrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Swap } from './pages/Swap';
import { Pools } from './pages/Pools';
import { AddLiquidity } from './pages/AddLiquidity';
import { RemoveLiquidity } from './pages/RemoveLiquidity';
import { Faucets } from './pages/Faucets';
import { Treasury } from './pages/Treasury';
import { TreasuryMint } from './pages/TreasuryMint';
import { Farming } from './pages/Farming';
import { Stake } from './pages/Stake';
import { Harvest } from './pages/Harvest';
import { Unstake } from './pages/Unstake';


const routes = [
  { index: true, element: <Swap /> },

  // swap
  { path: 'swap', element: <Swap /> },
  { path: 'swap/:pool', element: <Swap /> },

  // pools
  { path: 'pools', element: <Pools /> },
  { path: 'add-liquidity', element: <AddLiquidity /> },
  { path: 'add-liquidity/:pool', element: <AddLiquidity /> },
  { path: '/remove-liquidity/:address', element: <RemoveLiquidity /> },

  // farming
  { path: 'farming', element: <Farming /> },
  { path: 'farming/:farm/stake', element: <Stake /> },
  { path: 'farming/:farm/unstake', element: <Unstake /> },
  { path: 'farming/:farm/harvest', element: <Harvest /> },

  // treasury
  { path: 'treasury', element: <Treasury /> },
  { path: 'treasury/:address/:action', element: <TreasuryMint /> },
];

if (process.env.REACT_APP_TESTNET === 'true') {
  routes.push({ path: 'faucets', element: <Faucets /> });
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: routes,
  },
]);
