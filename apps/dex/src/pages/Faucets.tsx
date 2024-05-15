import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { th } from '@xstyled/styled-components';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { PrimaryButton } from '../components/PrimaryButton';
import { AddressInput } from '../components/AddressInput';
import { NumericalInput } from '../components/StyledInput';
import { useFaucets } from '../hooks/useFaucets';
import { addLiraDaoToken, addLiraToken, addWethToken } from '../utils';
import metamaskFox from '../img/metamask-fox.svg';
import { AddToMetamaskButton } from '@lira-dao/ui';


const StyledContainer = styled.div`
  max-width: 480px;
  padding: 34px 8px 0;
`;

const StyledHeaderContainer = styled.div`
  display: flex;
`;

interface HeaderItemProps {
  $active: boolean;
}

const StyledHeaderItem = styled.h3<HeaderItemProps>`
  padding: 8px 16px;
  color: ${props => props.$active ? th.color('primary') : 'white'};
  font-size: ${th.fontSize('l')};
  cursor: pointer;

  background: ${props => props.$active ? th.color('gray34') : 'transparent'};
  border-radius: ${props => props.$active ? '20px' : '0'};
`;

const StyledTitle = styled.h4`
  margin: 32px 0 16px;
`;

const StyledFormContainer = styled.div`
  padding: 24px 0 32px;
`;

const StyledInputContainer = styled.div`
  padding: 8px 0;
`;

const StyledErrorContainer = styled.div`
  height: 60px;
  padding: 16px 0 32px;
`;

const StyledError = styled.p`
  color: ${th.color('red-400')};
`;

enum ActiveHeaderItem {
  LDT = 'LDT',
  LIRA = 'LIRA',
  WETH = 'WETH',
}

export function Faucets() {
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
      open().then(() => console.log('Web3 modal open!'));
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

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <StyledHeaderItem
          $active={active === ActiveHeaderItem.LDT}
          onClick={() => changeTab(ActiveHeaderItem.LDT)}
        >LDT</StyledHeaderItem>
        <StyledHeaderItem
          $active={active === ActiveHeaderItem.LIRA}
          onClick={() => changeTab(ActiveHeaderItem.LIRA)}
        >LIRA</StyledHeaderItem>
        <StyledHeaderItem
          $active={active === ActiveHeaderItem.WETH}
          onClick={() => changeTab(ActiveHeaderItem.WETH)}
        >WETH</StyledHeaderItem>
      </StyledHeaderContainer>

      {!writeIsPending && !writeIsSuccess && <StyledTitle>Claim your testnet tokens every 24h</StyledTitle>}

      {!writeIsPending && !writeIsSuccess &&
        <StyledTitle>If you need funds on arbitrum sepolia:</StyledTitle>}

      {!writeIsPending && !writeIsSuccess && (
        <ul>
          <li>
            - Mine Sepolia ETH with the <a
            href="https://sepolia-faucet.pk910.de"
            target="_blank"
            rel="noopener noreferrer"
          >Pow Faucet</a>
          </li>
          <li>
            - Bridge funds to arbitrum sepolia with the <a
            href="https://bridge.arbitrum.io/?destinationChain=arbitrum-sepolia&sourceChain=sepolia"
            target="_blank"
            rel="noopener noreferrer"
          >Arbitrum Bridge</a>
          </li>
        </ul>
      )}

      {!writeIsPending && !writeIsSuccess &&
        <StyledTitle>For more information follow the guides on
          the <a href="https://docs.liradao.org/category/basic-guides" target="_blank" rel="noopener noreferrer">Docs
            Site</a>
        </StyledTitle>
      }

      {writeIsPending && <StyledTitle>Please confirm the transaction on your wallet to proceed</StyledTitle>}

      {writeIsSuccess &&
        <StyledTitle>Transaction sent correctly, test tokens will be available in a few seconds</StyledTitle>
      }

      {account.isConnected && !writeIsPending && !writeIsSuccess && (
        <StyledFormContainer>
          <StyledInputContainer>
            <h3>Wallet</h3>
            <AddressInput
              value={`0x${account.address?.slice(2, 8)}...${account.address?.slice(36)}`}
              disabled
              readOnly
            />
          </StyledInputContainer>

          <StyledInputContainer>
            <h3>Amount</h3>
            <NumericalInput
              id="amount"
              value={amount}
              disabled
              readOnly
            />
          </StyledInputContainer>
          <AddToMetamaskButton onClick={onAddToMetamask}>
            <img src={metamaskFox} alt="metamask icon" width={24} style={{ marginRight: 12 }} />Add To Metamask
          </AddToMetamaskButton>
        </StyledFormContainer>
      )}

      <StyledErrorContainer>
        {errorText && (<StyledError>{errorText}</StyledError>)}
      </StyledErrorContainer>

      {!writeIsPending && !writeIsSuccess && (
        <PrimaryButton onClick={onButtonClick}>{buttonText}</PrimaryButton>
      )}

      {writeIsSuccess && (
        <PrimaryButton onClick={() => reset()}>OK</PrimaryButton>
      )}
    </StyledContainer>
  );
}
