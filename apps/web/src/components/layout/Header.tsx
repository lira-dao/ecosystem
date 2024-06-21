import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Link, Typography, useTheme, useMediaQuery } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import logo from '../../img/logo-dao.png';
import button from '../../img/enter-app.png';
import twitter from '../../img/twitter.svg';
import discord from '../../img/discord.svg';

interface MenuItemProps {
  smallText: string;
  text: string;
  mx: number;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ text, smallText, isActive, mx }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm')); // This will check for screen sizes smaller than 'sm'

  return (
    <Typography
      sx={{
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        cursor: 'pointer',
        fontWeight: 400,
        fontSize: '18px',
        lineHeight: '27px',
        mx: mx,
        '&:hover': {
          color: theme.palette.common.white
        },
        '&:active': {
          color: theme.palette.primary.main
        },
        '::selection': {
          color: 'inherit',
          backgroundColor: 'transparent'
        },
        '::moz-selection': {
          color: 'inherit',
          backgroundColor: 'transparent'
        }
      }}
    >
      {matches ? smallText : text}
    </Typography>
  );
};

export const Header: React.FC = () => {
  const location = useLocation();

  const isContractsActive = location.pathname === '/contracts';
  const isDaoTeamActive = location.pathname === '/dao_team';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        height: 176,
        m: { xs: '20px 20px 0', sm: '0 20px' },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ width: [ 1, 1, 1 / 3, 1 / 3 ], display: 'flex', alignItems: 'center', justifyContent: ['center', 'center', 'center', 'flex-start'], mt: 2 }}>
          <NavLink to="/">
            <img src={logo} height={66} alt="lira dao logo" />
          </NavLink>
          <Link href="https://twitter.com/LIRA_DAO" target="_blank" rel="noreferrer" sx={{ marginLeft: 6, marginRight: 4 }}>
            <img src={twitter} height={28} alt="Twitter" />
          </Link>
          <Link href="https://discord.gg/fDRBajCB9V" target="_blank" rel="noreferrer">
            <img src={discord} height={28} alt="Discord" />
          </Link>
        </Box>
        <Box sx={{ width: [ 1, 1, 2 / 3, 2 / 3 ], display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}>
          <a href="https://whitepaper.liradao.org" target="_blank" rel="noreferrer">
            <MenuItem text="WHITEPAPER" smallText="WHITEPAPER" mx={3} />
          </a>

          <NavLink to="/contracts">
            <MenuItem text="CONTRACTS" smallText="CONTRACTS" mx={3} isActive={isContractsActive} />
          </NavLink>

          <NavLink to="/dao_team">
            <MenuItem text="DAO TEAM" smallText="TEAM" mx={3} isActive={isDaoTeamActive} />
          </NavLink>
        </Box>
        <Box sx={{ width: [ 1 / 3 ], display: ['none', 'none', 'none', 'flex'], justifyContent: 'flex-end' }}>
          <a href="https://dex.liradao.org" target="_blank" rel="noreferrer">
            <img src={button} width={200} alt="Buy LDT" />
          </a>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
