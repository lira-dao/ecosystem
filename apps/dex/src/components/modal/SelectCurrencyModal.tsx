import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, Avatar, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Currency } from '@lira-dao/web3-utils';
import AddToMetaMaskButton from '../AddTokenToMetamaskButton';

export interface SelectCurrencyModalProps {
  open: boolean;
  onClose: () => void;
  currencies: Currency[];
  onSelect: (currency: Currency) => void;
}

export function SelectCurrencyModal({
  open,
  onClose,
  currencies,
  onSelect,
}: SelectCurrencyModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          maxWidth: 420,
          minWidth: 420,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Select Token
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <List>
          {currencies.map((currency, i) => (
            <ListItem
              key={i}
              onClick={() => onSelect(currency)}
              sx={{
                // '&:hover': {
                //   backgroundColor: 'rgba(144, 202, 249, 0.1)',
                // },
                cursor: 'pointer'
              }}
            >
              <Avatar
                src={currency.icon}
                alt={currency.symbol}
                sx={{ width: 24, height: 24, marginRight: 2 }}
              />
              <Box sx={{ display: 'flex', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', flexGrow: 1 }}>
                  <Typography variant="body1" color="white" mr={1}>
                    {currency.symbol}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currency.name}
                  </Typography>
                </Box>
                <AddToMetaMaskButton token={currency} width="16px" height="16px" sx={{ ml: 'auto' }} />
              </Box>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
}
