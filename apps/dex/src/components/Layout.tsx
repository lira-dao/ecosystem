import { Outlet } from 'react-router-dom';
import { x } from '@xstyled/styled-components';
import { Header } from './Header';
import { Footer } from './Footer';


export function Layout() {
  return (
    <x.div display="flex" flexDirection="column" alignItems="center">
      <Header />
      <x.div w="100%" display="flex" alignItems="center" justifyContent="center">
        <Outlet />
      </x.div>
      <Footer />
    </x.div>
  );
}
