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
import { Staking } from './pages/Staking';
import { muiDarkTheme } from './theme/theme';
import { ThemeProvider } from '@mui/material/styles';


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

  // staking
  { path: 'farming', element: <Farming /> },
  { path: 'staking', element: <Staking /> },
  { path: ':stakers/:staker/stake', element: <ThemeProvider theme={muiDarkTheme}><Stake /></ThemeProvider> },
  { path: ':stakers/:staker/unstake', element: <Unstake /> },
  { path: ':stakers/:staker/harvest', element: <Harvest /> },

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
