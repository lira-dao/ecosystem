import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Box, CssBaseline, Drawer, IconButton, Link, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';
import logo from '../../img/logo-dao.png';
import button from '../../img/enter-app.png';
import twitter from '../../img/twitter.svg';
import discord from '../../img/discord.svg';

interface MenuItemProps {
  smallText?: string;
  text: string;
  to?: string;
  href?: string;
  mx: number;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ smallText, text, to, href, mx }) => {
  const location = useLocation();
  const theme = useTheme();

  const matches = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = location.pathname === to;

  if (to) {
    return (
      <Box component="div" m={2}>
        <NavLink to={to} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            sx={{
              mx: mx,
              color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
              cursor: 'pointer',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '27px',
              '&.active': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.common.white,
              },
            }}
          >
            {(matches && smallText) ? smallText : text}
          </Typography>
        </NavLink>
      </Box>
    );
  } else if (href) {
    return (
      <Box component="div" m={2} mt={2} >
        <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography
            sx={{
              mt: { sx: 4 },
              mx: mx,
              color: theme.palette.text.secondary,
              cursor: 'pointer',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '27px',
              '&:hover': {
                color: theme.palette.common.white,
              },
            }}
          >
            {text}
          </Typography>
        </a>
      </Box>
    );
  } else {
    return null;
  }
};

export const Header: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Box onClick={handleDrawerToggle} sx={{ width: 250 }} marginTop={2}>
        <MenuItem href="https://whitepaper.liradao.org" text="WHITEPAPER" mx={3} />
        <MenuItem to="/contracts" text="CONTRACTS" mx={3} />
        <MenuItem to="/dao_team" text="DAO TEAM" mx={3} />
      </Box>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 'auto',
        p: 2
      }}>
        <a href="https://dex.liradao.org" target="_blank" rel="noreferrer">
          <img src={button} width={200} alt="Buy LDT" />
        </a>
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={{
        height: 176,
        m: '20px 20px 0',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ width: [ 1, 1, 1 / 3, 1 / 3 ], display: 'flex', alignItems: 'center', justifyContent: ['space-between', 'space-between', 'center', 'flex-start'], mt: 2 }}>
          <NavLink to="/">
            <img src={logo} height={66} alt="lira dao logo" />
          </NavLink>

          {!isMobile && (
            <>
              <Link href="https://twitter.com/LIRA_DAO" target="_blank" rel="noreferrer" sx={{ marginLeft: 6, marginRight: 4 }}>
                <img src={twitter} height={28} alt="Twitter" />
              </Link>
              <Link href="https://discord.gg/fDRBajCB9V" target="_blank" rel="noreferrer">
                <img src={discord} height={28} alt="Discord" />
              </Link>
            </>
          )}

          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              sx={{ my: 1, mb: 4, '&:focus': { outline: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawerContent}
        </Drawer>

        {!isMobile && (
          <Box sx={{ width: [1, 1, 2 / 3], display: 'flex', justifyContent: 'center', flexWrap: 'nowrap' }}>
            <MenuItem href="https://whitepaper.liradao.org" text="WHITEPAPER" mx={2} />
            <MenuItem to="/contracts" text="CONTRACTS" mx={2} />
            <MenuItem to="/dao_team" text="DAO TEAM" smallText="TEAM" mx={2} />
          </Box>
        )}
        <Box sx={{ width: { lg: 'auto', xl: 1 / 3 }, display: ['none', 'none', 'none', 'flex'], justifyContent: 'flex-end' }}>
          <a href="https://dex.liradao.org" target="_blank" rel="noreferrer">
            <img src={button} width={200} alt="Buy LDT" />
          </a>
        </Box>
      </Box>
    </ThemeProvider>
  );
};
