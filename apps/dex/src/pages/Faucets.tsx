import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { AddToMetamaskButton } from '@lira-dao/ui';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useFaucets } from '../hooks/useFaucets';
import { PrimaryButton } from '../components/PrimaryButton';
import { AddressInput } from '../components/AddressInput';
import { NumericalInput } from '../components/StyledInput';
import { addLiraDaoToken, addLiraToken, addWethToken } from '../utils';
import { muiDarkTheme as theme } from '../theme/theme';
import metamaskFox from '../img/metamask-fox.svg';


enum ActiveHeaderItem {
  LDT = 'LDT',
  LIRA = 'LIRA',
  WETH = 'WETH',
}

export function Faucets() {
  const navigate = useNavigate();
  const account = useAccount();
  const { open } = useWeb3Modal();
  const {
    errorText,
    liraAmount,
    liraDaoTokenAmount,
    reset,
    wethAmount,
    writeIsPending,
    writeIsSuccess,
    writeLiraDaoTokenFaucet,
    writeLiraFaucet,
    writeWethFaucet,
  } = useFaucets();
  const [active, setActive] = useState<ActiveHeaderItem>(ActiveHeaderItem.LDT);
  const [buttonText, setButtonText] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  useEffect(() => {
    if (!account.isConnected) {
      setButtonText('CONNECT');
    } else {
      setButtonText('CLAIM');
    }
  }, [account.isConnected]);

  const onButtonClick = () => {
    if (!account.isConnected) {
      open().then(() => {
      });
    } else if (active === ActiveHeaderItem.LIRA) {
      writeLiraFaucet();
    } else if (active === ActiveHeaderItem.LDT) {
      writeLiraDaoTokenFaucet();
    } else if (active === ActiveHeaderItem.WETH) {
      writeWethFaucet();
    }
  };

  useEffect(() => {
    switch (active) {
      case ActiveHeaderItem.LDT:
        setAmount(`${liraDaoTokenAmount.toLocaleString()} LDT`);
        break;
      case ActiveHeaderItem.LIRA:
        setAmount(`${liraAmount.toLocaleString()} LIRA`);
        break;
      case ActiveHeaderItem.WETH:
        setAmount(`${wethAmount.toLocaleString()} WETH`);
        break;
      default:
        setAmount('0');
    }
  }, [active, liraAmount, liraDaoTokenAmount, wethAmount]);

  const onAddToMetamask = () => {
    switch (active) {
      case ActiveHeaderItem.LDT:
        addLiraDaoToken();
        break;
      case ActiveHeaderItem.LIRA:
        addLiraToken();
        break;
      case ActiveHeaderItem.WETH:
        addWethToken();
        break;
    }
  };

  const changeTab = (tab: ActiveHeaderItem) => {
    setActive(tab);
    reset();
  };

  if (!process.env.REACT_APP_TESTNET) {
    navigate('/', { replace: true });
  }

  return (
    <Box sx={{ maxWidth: 600, padding: '16px 8px 0' }}>
      <Box sx={{ display: 'flex' }}>
        <Button
          onClick={() => changeTab(ActiveHeaderItem.LDT)}
          sx={{
            flexGrow: 1,
            color: active === ActiveHeaderItem.LDT ? theme.palette.primary.main : theme.palette.text.secondary,
            fontWeight: active === ActiveHeaderItem.LDT ? 'bold' : 'normal',
            textTransform: 'none',
          }}
        >
          LDT
        </Button>
        <Button
          onClick={() => changeTab(ActiveHeaderItem.LIRA)}
          sx={{
            flexGrow: 1,
            color: active === ActiveHeaderItem.LIRA ? theme.palette.primary.main : theme.palette.text.secondary,
            fontWeight: active === ActiveHeaderItem.LIRA ? 'bold' : 'normal',
            textTransform: 'none',
          }}
        >
          LIRA
        </Button>
        <Button
          onClick={() => changeTab(ActiveHeaderItem.WETH)}
          sx={{
            flexGrow: 1,
            color: active === ActiveHeaderItem.WETH ? theme.palette.primary.main : theme.palette.text.secondary,
            fontWeight: active === ActiveHeaderItem.WETH ? 'bold' : 'normal',
            textTransform: 'none',
          }}
        >
          WETH
        </Button>
      </Box>

      {!writeIsPending && !writeIsSuccess && (
        <>
          <Typography variant="h6" sx={{ margin: '32px 0 16px' }}>
            Claim your testnet tokens every 24h
          </Typography>
          <Typography variant="h6">
            If you need funds on arbitrum sepolia:
          </Typography>
          <ul>
            <li>
              Mine Sepolia ETH with the <a
                href="https://sepolia-faucet.pk910.de"
                target="_blank"
                rel="noopener noreferrer"
              >Pow Faucet</a>
            </li>
            <li>
              Bridge funds to arbitrum sepolia with the <a
              href="https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia"
              target="_blank"
              rel="noopener noreferrer"
            >Arbitrum Bridge</a>
            </li>
          </ul>
          <Typography variant="h6">
            For more information follow the guides on the <a href="https://docs.liradao.org/category/basic-guides" target="_blank" rel="noopener noreferrer">Docs Site</a>
          </Typography>
        </>
      )}

      {writeIsPending && <Typography variant="h6" sx={{ margin: '32px 0 16px' }}>Please confirm the transaction on your wallet to proceed</Typography>}

      {writeIsSuccess && (
        <Typography variant="h6" sx={{ margin: '32px 0 16px' }}>Transaction sent correctly, test tokens will be available in a few seconds</Typography>
      )}

      {account.isConnected && !writeIsPending && !writeIsSuccess && (
        <Box sx={{ padding: '24px 0 32px' }}>
          <Box sx={{ padding: '8px 0' }}>
            <Typography variant="h6">Wallet</Typography>
            <AddressInput
              value={`0x${account.address?.slice(2, 8)}...${account.address?.slice(36)}`}
              disabled
              readOnly
            />
          </Box>

          <Box sx={{ padding: '8px 0' }}>
            <Typography variant="h6">Amount</Typography>
            <NumericalInput
              id="amount"
              value={amount}
              disabled
              readOnly
            />
          </Box>
          <AddToMetamaskButton onClick={onAddToMetamask}>
            <img src={metamaskFox} alt="metamask icon" width={24} style={{ marginRight: 12 }} />Add To Metamask
          </AddToMetamaskButton>
        </Box>
      )}

      <Box sx={{ height: 60, padding: '16px 0 32px' }}>
        {errorText && <Typography sx={{ color: theme.colors.red400 }}>{errorText}</Typography>}
      </Box>

      {!writeIsPending && !writeIsSuccess && (
        <PrimaryButton onClick={onButtonClick}>{buttonText}</PrimaryButton>
      )}

      {writeIsSuccess && (
        <PrimaryButton onClick={() => reset()}>OK</PrimaryButton>
      )}
    </Box>
  );
}
