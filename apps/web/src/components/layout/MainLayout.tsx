import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { NewHeader } from './NewHeader';
import { NewFooter } from './NewFooter';


export function MainLayout() {
  return (
    <>
      <Header />
      {/* <NewHeader /> */}

      <Outlet />
      <NewFooter />
    </>
  );
}
