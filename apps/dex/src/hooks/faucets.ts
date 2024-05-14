import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { baseFaucetAbi } from '@lira-dao/web3-utils';


const liraFaucetContract = {
  abi: baseFaucetAbi,
  address: '0x523467036cF121d7fc126470DeB7328Fcf162D94',
} as const;

const liraDaoTokenContract = {
  abi: baseFaucetAbi,
  address: '0x01005BEC75B3cd324F5cf61929bbD8A162042456',
} as const;

const wethFaucetContract = {
  abi: baseFaucetAbi,
  address: '0x21213dec708D26d87FE865eBd5c7deb716F892E3',
} as const;

export const useFaucets = () => {
  const { isConnected } = useAccount();
  const {
    writeContract,
    error: writeError,
    reset: writeReset,
    isPending: writeIsPending,
    isSuccess: writeIsSuccess,
  } = useWriteContract();
  const [liraAmount, setLiraAmount] = useState<bigint>(0n);
  const [liraDaoTokenAmount, setLiraDaoTokenAmount] = useState<bigint>(0n);
  const [wethAmount, setWethAmount] = useState<string>('');
  const [errorText, setErrorText] = useState<string>('');

  useEffect(() => {
    if (writeError) {
      console.log('set error!');

      // @ts-ignore
      switch (writeError.cause.reason) {
        case 'INSUFFICIENT_FUNDS':
          setErrorText('The faucet have insufficient funds. Try again later.');
          break;
        case 'NOT_ALLOWED':
          setErrorText('Please wait 24h before requesting funds.');
          break;
      }
    }
  }, [writeError]);

  const result = useReadContracts({
    query: {
      enabled: isConnected && liraAmount === 0n && liraDaoTokenAmount === 0n,
    },
    contracts: [{
      ...liraFaucetContract,
      functionName: 'tokenAmount',
    }, {
      ...liraDaoTokenContract,
      functionName: 'tokenAmount',
    }, {
      ...wethFaucetContract,
      functionName: 'tokenAmount',
    }],
  });

  useEffect(() => {
    if (result.status === 'success') {
      if (result.data[0].status === 'success') {
        setLiraAmount(result.data[0].result / 10n ** 8n);
      }

      if (result.data[1].status === 'success') {
        setLiraDaoTokenAmount(result.data[1].result / 10n ** 18n);
      }

      if (result.data[2].status === 'success') {
        setWethAmount((parseFloat(result.data[2].result.toString()) / parseFloat((10n ** 18n).toString())).toLocaleString());
      }
    }
  }, [result]);

  const writeLiraFaucet = () => {
    setErrorText('');

    writeContract({
      ...liraFaucetContract,
      functionName: 'withdraw',
    });
  };

  const writeLiraDaoTokenFaucet = () => {
    setErrorText('');

    writeContract({
      ...liraDaoTokenContract,
      functionName: 'withdraw',
    });
  };

  const writeWethFaucet = () => {
    setErrorText('');

    writeContract({
      ...wethFaucetContract,
      functionName: 'withdraw',
    });
  };

  const reset = () => {
    writeReset();
    setErrorText('');
  };

  return {
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
  };
};
