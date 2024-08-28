import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Currency } from '@lira-dao/web3-utils';

interface CurrencySelectorProps {
  disabled: boolean;
  selected: boolean;
  currency?: Currency;
  onClick?: () => void;
}

function CurrencyLogo({ logo, size }: { logo: string; size: number }) {
  return <img src={logo} alt="Currency Logo" style={{ width: size, height: size }} />;
}

export function CurrencySelector({ currency, disabled, selected, onClick }: CurrencySelectorProps) {
  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Button
        variant="outlined"
        disabled={disabled}
        onClick={onClick}
        sx={{
          height: '40px',
          justifyContent: 'space-between',
          color: 'text.secondary',
          borderColor: 'text.secondary',
          opacity: disabled ? 0.9 : 1,
          minWidth: '174px',
          width: '100%',
        }}
        startIcon={currency?.icon ? <CurrencyLogo logo={currency.icon} size={24} /> : null}
        endIcon={!disabled && <ArrowDropDownIcon />}
      >
        <Typography variant="body1" sx={{ marginLeft: currency ? 0 : 1, marginRight: disabled ? 1 : 0 }}>
          {currency ? currency.symbol : 'Select Coin'}
        </Typography>
      </Button>
    </Box>
  );
}
