import React, { useState } from 'react';
import { Box, Grid, Link } from '@mui/material';
import { useTheme, x } from '@xstyled/styled-components';
import Typography from "@mui/material/Typography";
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../theme/theme';


export function Footer() {
  const th = useTheme();
  const [hover, setHover] = useState(false);

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box 
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          padding: '20px',
        }}>
        <Grid container spacing={3} justifyContent="flex-end">
          <Grid item>
            <Typography variant="body2" color={th?.colors.gray155} gutterBottom>
              Prices by 
            </Typography>
            <Link href="https://coinmarketcap.com" target="_blank" rel="noopener noreferrer" 
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              sx={{
                textDecoration: 'none',
                color: hover ? th?.colors.white + '!important' : th?.colors.gray155 + '!important'
              }}>
              <Typography variant="subtitle1" sx={{ 
                fontSize: '0.8rem',
                textDecoration: 'none',
              }}>
                CoinMarketCap
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
