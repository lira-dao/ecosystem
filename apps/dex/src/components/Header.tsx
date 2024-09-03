import React, { useState } from 'react';
import { Box, Drawer, IconButton, Typography, useMediaQuery, useTheme, ThemeProvider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, To } from 'react-router-dom';
import logo from '../img/logo-dex.png';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ConnectButton } from './ConnectButton';
import { useAccount } from 'wagmi';
import { muiDarkTheme } from '../theme/theme';

interface MenuItemProps {
  text: string;
  to: To;
}

function MenuItem({ text, to }: MenuItemProps) {
  const theme = useTheme();
  const activeStyle = {
    color: `${muiDarkTheme.colors.red400} !important`,
  };

  return (
    <Box component="div" m={4}>
      <NavLink
        to={to}
        style={({ isActive }) => ({
          color: isActive ? muiDarkTheme.colors.green[400] : muiDarkTheme.colors.gray155,
          cursor: 'pointer',
          fontSize: theme.typography?.pxToRem(16),
          fontWeight: theme.typography?.fontWeightMedium,
          textDecoration: 'none',
        })}
      >
        <Typography
          sx={{
            // '&.active': {
            //   color: ,
            // },
            '&:hover': {
              color: `${muiDarkTheme.colors.white} !important`,
            },
          }}
        >
          {text}
        </Typography>
      </NavLink>
    </Box>
  );
}

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <>
      <Box onClick={handleDrawerToggle} sx={{ width: 250 }} marginTop={2}>
        <MenuItem text="PORTFOLIO" to="/portfolio" />
        <MenuItem text="SWAP" to="/swap" />
        <MenuItem text="TREASURY" to="/treasury" />
        <MenuItem text="POOLS" to="/pools" />
        <MenuItem text="FARMING" to="/farming" />
        <MenuItem text="STAKING" to="/staking" />
        {process.env.REACT_APP_TESTNET === 'true' && <MenuItem text="FAUCETS" to="/faucets" />}
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 'auto',
          p: 2,
        }}
      >
        {isConnected ? (
          <Box component="span" sx={{ p: 2 }}>
            <w3m-account-button balance="hide" />
          </Box>
        ) : (
          <ConnectButton onClick={() => open()} />
        )}
      </Box>
    </>
  );

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          width: '100%',
          p: 2,
          display: 'flex',
          flexDirection: { xs: 'row', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 4,
        }}
      >
        <a href="https://liradao.org" target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="lira dao logo" width={120} />
        </a>

        {isMobile && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ my: 1, '&:focus': { outline: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
        )}

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
          <Box sx={{ display: 'flex', flexGrow: 1 }}>
            <MenuItem text="PORTFOLIO" to="/portfolio" />
            <MenuItem text="SWAP" to="/swap" />
            <MenuItem text="TREASURY" to="/treasury" />
            <MenuItem text="POOLS" to="/pools" />
            <MenuItem text="FARMING" to="/farming" />
            <MenuItem text="STAKING" to="/staking" />
            {process.env.REACT_APP_TESTNET === 'true' && <MenuItem text="FAUCETS" to="/faucets" />}
          </Box>
        )}

        {!isMobile && (isConnected ? (
          <Box component="span" sx={{ p: 2 }}>
            <w3m-account-button balance="hide" />
          </Box>
        ) : (
          <ConnectButton onClick={() => open()} />
        ))}
      </Box>
    </ThemeProvider>
  );
}
