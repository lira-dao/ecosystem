import React, { useState } from 'react';
import { Box, Grid, Link } from '@mui/material';
import { useTheme } from '@xstyled/styled-components';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../theme/theme';


export function Footer() {
  const th = useTheme();
  const [hover, setHover] = useState(false);

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          width: '100%',
          height: '70px',
          bgcolor: 'background.paper',
        }}
      >
        <Grid container display="flex" justifyContent="end" alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            Prices by
            <Link
              href="https://coinmarketcap.com" target="_blank" rel="noopener noreferrer"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              sx={{
                color: hover ? th?.colors.white + '!important' : th?.colors.gray155 + '!important',
                textDecoration: 'none',
                ml: 1,
              }}
            >
              CoinMarketCap
            </Link>
          </Typography>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
