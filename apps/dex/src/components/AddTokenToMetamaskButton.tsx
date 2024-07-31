import React from 'react';
import { Button, Tooltip } from '@mui/material';

interface AddToMetaMaskButtonProps {
  token: {
    address: string;
    symbol: string;
    decimals: number;
    image?: string;
    isNative?: boolean;
  };
}

const AddToMetaMaskButton: React.FC<AddToMetaMaskButtonProps> = ({ token }) => {
  const addTokenToMetaMask = async () => {
    if (!window.ethereum) {
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
            image: token.image,
          },
        },
      });
    } catch (error) {
      console.error('Failed to add token to MetaMask', error);
    }
  };

  if (token.isNative) {
    return null;
  }

  return (
    <Tooltip title={`Add ${token.symbol} to MetaMask`}>
      <Button
        onClick={addTokenToMetaMask}
        size="small"
        variant="outlined"
        style={{color: "white"}}
      >
        Add to MetaMask
      </Button>
    </Tooltip>
  );
};

export default AddToMetaMaskButton;
