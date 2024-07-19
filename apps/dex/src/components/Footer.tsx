import React, { useState } from 'react';
import { Box, Container, Grid, Link } from '@mui/material';
import { useTheme } from '@xstyled/styled-components';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../theme/theme';


interface FooterProps {
  isFixed: boolean;
}

export function Footer({ isFixed }: FooterProps) {
  const th = useTheme();
  const [hover, setHover] = useState(false);

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          position: 'relative',
          bottom: 0,
          left: 0,
          width: '100%',
          bgcolor: 'background.paper',
          py: 2,
          px: 2,
          boxShadow: isFixed ? '0 -1px 10px rgba(0, 0, 0, 0.12)' : 'none',
          mt: 'auto'
        }}
      >
        <Container>
          <Grid container display="flex" justifyContent="end" alignItems="center">
            <Typography variant="body2" color="text.secondary" noWrap>
              Prices by 
              <Link href="https://coinmarketcap.com" target="_blank" rel="noopener noreferrer" 
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{
                  color: hover ? th?.colors.white + '!important' : th?.colors.gray155 + '!important',
                  textDecoration: 'none',
                  ml: 1
                }}
              >
                CoinMarketCap
              </Link>
            </Typography>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
