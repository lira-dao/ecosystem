import { useReadContract } from 'wagmi';
import { Currency } from '../types';
import { addresses, dexFactoryV2Abi, dexPairV2Abi } from '@lira-dao/web3-utils';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';


export function usePair(currencyA: Currency, currencyB: Currency) {
  const pair = useReadContract({
    abi: dexFactoryV2Abi,
    address: addresses.arbitrumSepolia.factory as `0x${string}`,
    functionName: 'getPair',
    args: [currencyA.address as `0x${string}`, currencyB.address as `0x${string}`],
  });

  const reserves = useReadContract({
    abi: dexPairV2Abi,
    address: pair.data,
    functionName: 'getReserves',
    query: {
      enabled: !!pair.data,
    },
  });

  // console.log('pair.data', pair.data);
  console.log('reserves', reserves);

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

  console.log('priceCurrencyA', priceCurrencyA);
  console.log('priceCurrencyB', priceCurrencyB);

  return {
    ...pair,
    priceCurrencyA,
    priceCurrencyB,
    reserveA: reserves.data?.[0] ?? 0n,
    reserveB: reserves.data?.[1] ?? 0n,
  };
}
