import React, { ChangeEvent, useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import styled, { ThemeProvider } from 'styled-components';
import { AddToMetamaskButton, Col, Row } from '@lira-dao/ui';
import { Typography } from '../components/ui';
import theme from '../theme';
import { LiraDaoPresaleAbi } from '../abi/LiraDaoPresaleAbi';
import button from '../img/buy-ldt.svg';
import metamaskFox from '../img/metamask-fox.svg';
import { Countdown } from '../components/Countdown/Countdown';
import { StyledButton } from '../components/ui/StyledButton';

import ArbitrumSepoliaLiraDaoPresaleContract
  from '@lira-dao/presale/deployments/chain-421614/deployed_addresses.json';

import ArbitrumLiraDaoPresaleContract
  from '@lira-dao/presale/deployments/chain-42161/deployed_addresses.json';
import { addLiraDaoToken } from '../utils/addLiraToken';

type EthereumAddress = `0x${string}` | undefined

const getPresaleContractAddress = () => {
  switch (process.env.REACT_APP_CHAIN_ID) {
    case '421614':
      return ArbitrumSepoliaLiraDaoPresaleContract['LiraDaoPresale#LiraDaoPresale'] as EthereumAddress;
    case '42161':
      return ArbitrumLiraDaoPresaleContract['LiraDaoPresale#LiraDaoPresale'] as EthereumAddress;
  }
};

const StyledInput = styled.input`
  flex: 1;
  height: 50px;
  background-color: transparent;
  border: 1px solid ${props => props.disabled ? 'gray' : 'white'};
  border-radius: 10px;
  color: white;
  padding: 0 16px;
  font-size: 18px;
`;


export function Presale() {
  const { isConnected, chainId } = useAccount();
  const [amount, setAmount] = useState<string>('0');
  const [ldtAmount, setLdtAmount] = useState<number>(0);
  const [ethAmount, setEthAmount] = useState<bigint>(0n);
  const [error, setError] = useState<string | null>('');

  const {
    writeContract,
    data: buyData,
    error: buyError,
    isPending: buyIsPending,
    isIdle: buyIsIdle,
    isPaused: buyIsPaused,
    isSuccess: buyIsSuccess,
    submittedAt: buySubmittedAt,
    reset: buyReset,
  } = useWriteContract();

  const { data: roundData } = useReadContract({
    abi: LiraDaoPresaleAbi,
    functionName: 'round',
    address: getPresaleContractAddress(),
  });

  const { data: quoteBuyData } = useReadContract({
    abi: LiraDaoPresaleAbi,
    functionName: 'quoteBuy',
    address: getPresaleContractAddress(),
    args: [ethAmount],
    query: {
      enabled: !!ethAmount,
    },
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (Number(value) < 0) {
      setAmount('0');
    } else {
      const etherValueBigInt: bigint = BigInt(Math.floor(Number(value) * 10 ** 18));

      setEthAmount(etherValueBigInt);
      setAmount(value);
    }
  };

  useEffect(() => {
    const etherValue: number = Number(quoteBuyData) / 10 ** 18;

    const amount = parseFloat(etherValue.toFixed(4));

    setLdtAmount(Number.isNaN(amount) ? 0 : amount);

  }, [quoteBuyData]);

  useEffect(() => {
    if (buyError) {
      // @ts-ignore
      switch (buyError.cause.reason) {
        case 'LDT_PRESALE_MIN_BUY':
          setError('Minimum ETH value is 0.000001');
      }

    } else {
      setError(null);
    }
  }, [buyError]);


  const buy = () => {
    const address = getPresaleContractAddress();

    if (address) {
      writeContract({
        abi: LiraDaoPresaleAbi,
        functionName: 'buy',
        address,
        value: ethAmount,
      });
    }
  };

  const onGoBackClick = () => {
    setAmount('0');
    setEthAmount(0n);
    buyReset();
  };

  return (
    <ThemeProvider theme={theme}>
      <Col minHeight="100vh" marginX={40} alignItems="center">
        <Col textAlign="center">
          <Typography as="h3" margin={0} mb={50}>Presale Is Over!</Typography>
          <Typography as="h5" margin={0} mb={50}>You can soon swap tokens through the LIRA DEX!</Typography>
        </Col>
        {/*<Col textAlign="center">*/}
        {/*  {roundData && <Typography as="h3" margin={0} mb={50}>Phase {roundData.number.toString()}</Typography>}*/}
        {/*  {roundData && <Countdown date={new Date(Number(roundData.end) * 1000)} />}*/}
        {/*</Col>*/}

        {/*{isConnected ? (*/}
        {/*  <>*/}
        {/*    {chainId !== Number(process.env.REACT_APP_CHAIN_ID) ? (*/}
        {/*      <Col alignItems="center" textAlign="center">*/}
        {/*        <Typography mt={80} mb={80}>Please switch to the <b>Arbitrum One</b> network to participate in the Presale and*/}
        {/*          access LIRA DAO features.</Typography>*/}
        {/*      </Col>*/}
        {/*    ) : buyIsPending ? (*/}
        {/*      <Typography mt={80}>Transaction is pending, please confirm on metamask</Typography>*/}
        {/*    ) : buyIsSuccess ? (*/}
        {/*      <>*/}
        {/*        <Typography mt={80} mb={80}>Transaction success!</Typography>*/}
        {/*        <StyledButton onClick={onGoBackClick}>*/}
        {/*          <Typography color="white" margin={0} flexGrow={1}>Go Back</Typography>*/}
        {/*        </StyledButton>*/}
        {/*      </>*/}
        {/*    ) : (*/}
        {/*      <>*/}
        {/*        <Col width={1} alignItems="center" my={60}>*/}
        {/*          <Row width={1 / 3} mt={20} mb={10} alignItems="center" justifyContent="center">*/}
        {/*            <StyledInput id="amount" name="amount" type="number" value={amount} onChange={handleChange} />*/}
        {/*            <Typography as="h6" color="white" margin={0} marginLeft={12}>ETH</Typography>*/}
        {/*          </Row>*/}

        {/*          <Row width={1 / 3} mt={20} mb={10} alignItems="center" justifyContent="center">*/}
        {/*            <StyledInput id="ldt-amount" name="ldt-amount" type="number" value={ldtAmount} disabled />*/}
        {/*            <Typography as="h6" color="white" margin={0} marginLeft={12}>LDT</Typography>*/}
        {/*          </Row>*/}

        {/*          {roundData ? (*/}
        {/*            <Row width={[1, 1 / 3]}>*/}
        {/*              <Typography>*/}
        {/*                Enjoy your purchase in the current presale phase. Grab your tokens now!*/}
        {/*              </Typography>*/}
        {/*            </Row>*/}
        {/*          ) : null}*/}

        {/*          {error ? <Typography color="red">{error}</Typography> : null}*/}
        {/*        </Col>*/}

        {/*        <Col alignItems="center">*/}
        {/*          <img onClick={buy} style={{ cursor: 'pointer' }} src={button} width={300} alt="Buy LDT" />*/}
        {/*          <Col my={20} />*/}
        {/*          <AddToMetamaskButton onClick={addLiraDaoToken}>*/}
        {/*            <img src={metamaskFox} alt="metamask icon" width={24} style={{marginRight: 12}} />Add To Metamask*/}
        {/*          </AddToMetamaskButton>*/}
        {/*        </Col>*/}
        {/*      </>*/}
        {/*    )}*/}
        {/*  </>*/}
        {/*) : (*/}
        {/*  <Row mt={80}>*/}
        {/*    <Typography>Connect your wallet to access the LIRA DAO platform and participate in the Presale!</Typography>*/}
        {/*  </Row>*/}
        {/*)}*/}
      </Col>
    </ThemeProvider>
  );
}
