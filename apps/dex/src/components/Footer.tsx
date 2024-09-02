import React, { useState } from 'react';
import { Box, Grid, Link, useTheme } from '@mui/material';
import Typography from '@mui/material/Typography';
import twitter from '../img/twitter.png';
import discord from '../img/discord.svg';
import telegram from '../img/telegram.png';

export function Footer() {
  const [hover, setHover] = useState(false);
  const th = useTheme();

  return (
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
                color: th.palette.text.secondary,
                textDecoration: 'none',
                ml: 1,
                '&:visited': {
                  color: th.palette.text.secondary,
                },
                '&:hover': {
                  color: th.palette.common.white,
                },
              }}
            >
              CoinMarketCap
            </Link>
          </Typography>
        </Grid>
    </Box>
  );
}
