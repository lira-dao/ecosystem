import React from 'react';
import { Box } from '@mui/material';
import blankToken from '../img/blank-token.svg';

interface CurrencyLogoProps {
  logo?: string;
  size: number;
}

export function CurrencyLogo({ size, logo }: CurrencyLogoProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        overflow: 'hidden',
        width: size,
        height: size,
      }}
    >
      <img
        src={logo ? logo : blankToken}
        alt="Currency Logo"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
        }}
      />
    </Box>
  );
}
