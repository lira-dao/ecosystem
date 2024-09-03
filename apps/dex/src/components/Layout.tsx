import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';


export function Layout() {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="100vh">
      <Header />
      <Box
        width="100%"
        display="flex"
        flexGrow={1}
        justifyContent="center"
        mb={4}
      >
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
