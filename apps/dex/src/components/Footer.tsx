import React from 'react';
import { Box, Grid, Link } from '@mui/material';

import Typography from "@mui/material/Typography";
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../theme/theme';


export function Footer() {
  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box 
        sx={{
          // margin: '20px 20px 0',
          marginTop: '40px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container spacing={3} justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="common.white" gutterBottom>
              Powered by 
            </Typography>
            <Link href="https://coinmarketcap.com" target="_blank" rel="noopener noreferrer">
              <Typography variant="subtitle1" color="common.white">
                CoinMarketCap
              </Typography>
            </Link>
          </Grid>
        </Grid>

        {/* <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </Typography> */}
      </Box>
    </ThemeProvider>
  );
}
