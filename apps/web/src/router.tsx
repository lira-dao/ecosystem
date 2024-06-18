import { createBrowserRouter, Navigate, redirect } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
// import { Home } from './pages/Home';
import { NewHome } from './pages/Home/NewHome';
import { Contracts } from './pages/Contracts';
import { DaoTeam } from './pages/DaoTeam/DaoTeam';


function Presale() {
  return <Navigate replace to="/" />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <NewHome /> },
      { path: 'contracts', element: <Contracts /> },
      { path: 'dao_team', element: <DaoTeam /> },
      { path: 'presale', element: <Presale />}
    ],
  },
]);
