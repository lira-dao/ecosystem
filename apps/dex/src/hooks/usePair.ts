import { useReadContract } from 'wagmi';
import { Currency } from '../types';
import { dexFactoryV2Abi, dexPairV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useDexAddresses } from './useDexAddresses';


export function usePair(currencyA: Currency, currencyB?: Currency) {
  const dexAddresses = useDexAddresses();

  const pair = useReadContract({
    abi: dexFactoryV2Abi,
    address: dexAddresses.factory,
    functionName: 'getPair',
    args: [currencyA.address, currencyB?.address as EthereumAddress],
    query: {
      enabled: !!currencyA && !! currencyB,
    }
  });

  const reserves = useReadContract({
    abi: dexPairV2Abi,
    address: pair.data,
    functionName: 'getReserves',
    query: {
      enabled: !!pair.data,
    },
  });

  const priceCurrencyA = useMemo(() => {
    if (Array.isArray(reserves.data)) {
      return new BigNumber(reserves.data[1].toString()).div(reserves.data[0].toString());
    }

    return new BigNumber(0);
  }, [reserves]);

  const priceCurrencyB = useMemo(() => {
    if (Array.isArray(reserves.data)) {
      return new BigNumber(reserves.data[0].toString()).div(reserves.data[1].toString());
    }

    return new BigNumber(0);
  }, [reserves]);

  return {
    ...pair,
    priceCurrencyA,
    priceCurrencyB,
    reserveA: reserves.data?.[0] ?? 0n,
    reserveB: reserves.data?.[1] ?? 0n,
  };
}
