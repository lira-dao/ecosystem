import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Tokens } from './pages/Tokens';
import { Presale } from './pages/Presale';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tokens', element: <Tokens /> },
      { path: 'presale', element: <Presale /> },
    ],
  },
]);
