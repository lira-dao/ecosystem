import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import muiTheme from '../../theme_mui';

import DexContractsTable from './components/DexContractsTable';
import LiquidityPoolsTable from './components/LiquidityPoolsTable';
import TokensTable from './components/TokensTable';


export function Contracts() {
  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="lg" sx={{ p: 4, display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h4" component="h1" color="white">Tokens</Typography>
        </Box>

        <TokensTable></TokensTable>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h1" color="white">Dex</Typography>
        </Box>

        <DexContractsTable></DexContractsTable>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 8, mb: 4 }}>
          <Typography variant="h4" component="h1" color="white">Pools</Typography>
        </Box>

        <LiquidityPoolsTable></LiquidityPoolsTable>
      </Container>
    </ThemeProvider>
  );
}