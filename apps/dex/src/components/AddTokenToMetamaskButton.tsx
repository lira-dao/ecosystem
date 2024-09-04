import React from 'react';
import { Button, ButtonProps, Tooltip, useTheme } from '@mui/material';
import { Currency, EthereumAddress } from '@lira-dao/web3-utils';
import metamask from '../img/metamask.png';

export interface CustomCurrency {
  address: EthereumAddress;
  symbol: string;
  decimals: number;
  icon?: string;
}

interface AddToMetaMaskButtonProps {
  token: Currency | undefined;
  width?: string | number;
  height?: string | number;
}

const AddToMetaMaskButton: React.FC<AddToMetaMaskButtonProps & ButtonProps> = ({
  token,
  width = '25px',
  height = '25px',
  sx,
  ...props
}) => {
  const theme = useTheme();

  const addTokenToMetaMask = async () => {
    if (!window.ethereum || !token) {
      alert('MetaMask is not installed!');
      return;
    }

    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.icon,
          },
        },
      });
    } catch (error) {
      console.error('Failed to add token to MetaMask', error);
    }
  };

  if (!token || token.isNative) {
    return null;
  }

  return (
    <Tooltip title={`Add ${token.symbol} to MetaMask`}>
      <Button
        onClick={addTokenToMetaMask}
        sx={{
          color: theme.palette.common.white,
          ...sx,
        }}
        {...props}
      >
        <img
          src={metamask}
          alt="metamask"
          style={{ width, height }}
        />
      </Button>
    </Tooltip>
  );
};

export default AddToMetaMaskButton;
