import React from 'react';
import { Box } from '@mui/material';
import connect from '../img/connect-button.png';

interface ConnectButtonProps {
  onClick?: () => void;
}

export const ConnectButton: React.FC<ConnectButtonProps> = ({ onClick }) => (
  <Box
    component="button"
    onClick={onClick}
    sx={{
      width: '164px',
      height: '44px',
      cursor: 'pointer',
      padding: 0,
      margin: 0,
      border: 'none',
      background: 'none',
      '&:hover': {
        transform: 'translateX(-6px)',
        transition: 'transform 200ms ease',
      },
      '&:focus': {
        outline: 'none',
      },
    }}
  >
    <img src={connect} alt="Connect" style={{ width: '100%', height: '100%' }} />
  </Box>
);
