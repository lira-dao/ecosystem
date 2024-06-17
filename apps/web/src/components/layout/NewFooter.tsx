import React from 'react';
import { NavLink } from 'react-router-dom';
import { Box, Grid } from '@mui/material';
import Link from "@mui/material/Link";

import Typography from "@mui/material/Typography";
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme_mui';
import logo from '../../img/logo-dao.png';
import twitter from '../../img/twitter.svg';
import discord from '../../img/discord.svg';

interface FooterTitleProps {
  children: React.ReactNode;
}

const FooterTitle: React.FC<FooterTitleProps> = ({ children }) => (
  <Typography
    sx={{
      color: 'white',
      fontWeight: 700,
      lineHeight: '48px',
      fontSize: '32px',
      letterSpacing: '0em',
      textAlign: 'left',
      textDecorationLine: 'underline'
    }}
  >
    {children}
  </Typography>
);

interface FooterItemProps {
  children: React.ReactNode;
}

const FooterItem: React.FC<FooterItemProps> = ({ children }) => (
  <Typography
    sx={{
      color: 'text.secondary',
      cursor: 'pointer',
      fontWeight: 400,
      lineHeight: '26px',
      fontSize: 'lg.fontSize',
      letterSpacing: '0em',
      textAlign: 'left',
      // margin: '0px',
      padding: { xs: '12px 0' },
      '&:hover': {
        color: 'white',
      },
      '&:active': {
        color: 'primary.main'
      },
      '::selection': {
        color: 'inherit',
        backgroundColor: 'transparent'
      }
    }}
  >
    {children}
  </Typography>
);

interface FooterTextProps {
  children: React.ReactNode;
}

const FooterText: React.FC<FooterTextProps> = ({ children }) => (
  <Typography
    sx={{
      color: 'white',
      fontWeight: 600,
      lineHeight: '26px',
      fontSize: 'lg.fontSize',
      marginBottom: '40px'
    }}
  >
    {children}
  </Typography>
);

export function NewFooter() {
  return (
    <ThemeProvider theme={theme}>
      <Box 
        sx={{
          margin: '20px 20px 0',
          marginTop: '80px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: '100%',
            marginBottom: '50px',
            flexDirection: ['column', 'row', 'row', 'row'],
            justifyContent: 'space-around',
            display: 'flex'
          }}
        >
          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={12} sm={4} display="flex" flexDirection="column" sx={{ mb: { xs: 4, sm: 0 } }}>
              <NavLink to="/">
                <img src={logo} height={66} alt="LIRA DAO logo" />
              </NavLink>
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Link href="https://twitter.com/LIRA_DAO" target="_blank" rel="noreferrer" style={{ margin: '16px' }}>
                  <img src={twitter} height={28} alt="Twitter" />
                </Link>
                <Link href="https://discord.gg/fDRBajCB9V" target="_blank" rel="noreferrer" style={{ margin: '16px' }}>
                  <img src={discord} height={28} alt="Discord" />
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} display="flex" flexDirection="column">
              <FooterTitle>SECTIONS</FooterTitle>

              <Box sx={{ pt: 4, pb: 4}}>
                <a href="https://whitepaper.liradao.org" target="_blank" rel="noreferrer">
                  <FooterItem>
                    White Paper
                  </FooterItem>
                </a>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4} display="flex" flexDirection="column">
              <FooterTitle>INFO</FooterTitle>

              <Box sx={{ pt: 4, pb: 4}}>
                <FooterItem>
                  LIRA DAO
                </FooterItem>
                <FooterItem>
                  social@liradao.org
                </FooterItem>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ width: '100%' }}>
          <FooterText>©2024 LIRA DAO. All rights reserved</FooterText>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
