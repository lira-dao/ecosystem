import React, { useState } from 'react';
import { Box, Container, Grid, Link } from '@mui/material';
import { useTheme } from '@xstyled/styled-components';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../theme/theme';
import twitter from '../img/twitter.png';
import discord from '../img/discord.svg';
import telegram from '../img/telegram.png';


export function Footer() {
  const th = useTheme();
  const [hover, setHover] = useState(false);

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          width: '100%',
          height: '70px',
          display: 'flex',
          justifyContent: 'end',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          px: 4,
        }}
      >
        <Container>
          <Grid
            container
            display="flex"
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: {
                  xs: 2,
                  sm: 3,
                  md: 4,
                },
              }}
            >
              <Link
                href="https://twitter.com/LIRA_DAO"
                target="_blank"
                rel="noreferrer"
              >
                <Box
                  component="img"
                  src={twitter}
                  alt="Twitter"
                  sx={{
                    height: { xs: 20, md: 24 },
                    width: 'auto',
                  }}
                />
              </Link>
              <Link
                href="https://discord.gg/fDRBajCB9V"
                target="_blank"
                rel="noreferrer"
              >
                <Box
                  component="img"
                  src={discord}
                  alt="Discord"
                  sx={{
                    height: { xs: 16, md: 20 },
                    width: 'auto',
                  }}
                />
              </Link>
              <Link
                href="https://t.me/LIRA_DAO"
                target="_blank"
                rel="noreferrer"
              >
                <Box
                  component="img"
                  src={telegram}
                  alt="Telegram"
                  sx={{
                    height: { xs: 20, md: 24 },
                    width: 'auto',
                  }}
                />
              </Link>
            </Box>
            <Typography variant="body2" color="text.secondary" noWrap>
              Prices by
              <Link
                href="https://coinmarketcap.com"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                sx={{
                  color: hover
                    ? th?.colors.white + '!important'
                    : th?.colors.gray155 + '!important',
                  textDecoration: 'none',
                  ml: 1,
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
