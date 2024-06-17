import { Outlet } from 'react-router-dom';
import { NewHeader } from './NewHeader';
import { NewFooter } from './NewFooter';


export function MainLayout() {
  return (
    <>
      <NewHeader />
      <Outlet />
      <NewFooter />
    </>
  );
}
