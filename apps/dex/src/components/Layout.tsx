import React, { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Box } from '@mui/material';


export function Layout() {
  const [isFooterFixed, setIsFooterFixed] = useState(true);
  const contentRef = useRef(null);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />
      <Box
        width="100%"
        flexGrow={1}
        display="flex"
        justifyContent="center"
        paddingBottom={isFooterFixed ? '24px' : '0px'}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
