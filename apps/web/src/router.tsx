import { createBrowserRouter, Navigate, redirect } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { Tokens } from './pages/Tokens';


function Presale() {
  return <Navigate replace to="/" />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'tokens', element: <Tokens /> },
      { path: 'presale', element: <Presale />}
    ],
  },
]);
