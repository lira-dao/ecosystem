import { ChangeEvent } from 'react';
import { Box, Typography, Button, TextField, ThemeProvider } from '@mui/material';
import { Currency, EthereumAddress } from '@lira-dao/web3-utils';
import BigNumber from 'bignumber.js';
import AddToMetaMaskButton, { CustomCurrency } from '../AddTokenToMetamaskButton';
import { CurrencySelector } from '../CurrencySelector';

interface CurrencyInputProps {
  balance: bigint;
  label?: string;
  currency?: Currency | CustomCurrency;
  disabled: boolean;
  formattedBalance: string;
  id: string;
  insufficientBalance: boolean;
  errorMessage?: string;
  isDisabledCurrencySelector?: boolean;
  onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
  onCurrencySelectClick?: () => void;
  onSetPercentage: (value: string) => void;
  selected: boolean;
  showPercentages?: boolean;
  percentageBaseValue?: BigNumber;
  title: string;
  value: string;
  price?: string;
}

export function CurrencyInput({
  balance,
  label = 'Balance',
  currency,
  disabled = false,
  formattedBalance,
  id,
  insufficientBalance,
  errorMessage = 'Insufficient balance',
  isDisabledCurrencySelector = false,
  onChangeValue,
  onCurrencySelectClick,
  onSetPercentage,
  selected = false,
  showPercentages = false,
  percentageBaseValue,
  title,
  value,
  price,
}: CurrencyInputProps) {

  const handlePercentageClick = (percentage: number) => {

    const calculatedValue = new BigNumber(percentageBaseValue || balance.toString())
      .times(percentage)
      .div(100)
      .div(percentageBaseValue ? 1 : new BigNumber(10).pow(currency?.decimals || 18))
      .toFixed();

    onSetPercentage(calculatedValue);
  };

  const isValidNumber = (val: string) => {
    const number = parseFloat(val);
    return !isNaN(number) && number > 0;
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }} gutterBottom>
        {title}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CurrencySelector
          currency={currency}
          disabled={isDisabledCurrencySelector}
          selected={selected}
          onClick={onCurrencySelectClick}
        />
        <TextField
          id={id}
          fullWidth
          variant="outlined"
          size="small"
          value={value}
          onChange={onChangeValue}
          disabled={disabled || !currency}
          InputProps={{
            // endAdornment: <Typography color="text.secondary">{currency?.symbol}</Typography>,
            sx: {
              flexGrow: 1,
              backgroundColor: 'transparent',
              '&:focus': {
                backgroundColor: 'transparent',
              },
            },
          }}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: insufficientBalance ? 'space-between' : 'flex-end', alignItems: 'center', my: 1 }}>
          {insufficientBalance && (
            <Typography variant="body2" color="error">{errorMessage}</Typography>
          )}
          {price && (
            <Typography variant="body2" color={insufficientBalance ? 'error' : 'text.secondary'}>
              {(price && !isNaN(parseFloat(price)) && value.toString() !== '' && isValidNumber(value)) ? `~$${(parseFloat(value) * parseFloat(price)).toFixed(2)}` : `~$0.00`}
            </Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>{label}: {formattedBalance}</Typography>
          <AddToMetaMaskButton token={currency as Currency} />
        </Box>
      </Box>

      {showPercentages && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2 }}>
          {[10, 25, 50, 75, 100].map((percentage) => (
            <Button
              key={percentage}
              color='secondary'
              disabled={!balance || new BigNumber(balance.toString()).isZero()}
              size='small'
              variant='outlined'
              sx={{ flex: '1 1 auto', margin: '0 6px', height: '100%', paddingTop: '6px' }}
              onClick={() => handlePercentageClick(percentage)}
            >
              {percentage}%
            </Button>
          ))}
        </Box>
      )}
    </Box>
  );
}
