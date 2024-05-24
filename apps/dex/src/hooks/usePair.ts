import { useContractReads, useReadContract } from 'wagmi';
import { Currency, dexFactoryV2Abi, dexPairV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
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
      enabled: !!currencyA && !!currencyB,
    },
  });

  const reserves = useReadContract({
    abi: dexPairV2Abi,
    address: pair.data,
    functionName: 'getReserves',
    query: {
      enabled: !!pair.data,
    },
  });

  const tokens = useContractReads({
    contracts: [{
      abi: dexPairV2Abi,
      address: pair.data,
      functionName: 'token0',
    }, {
      abi: dexPairV2Abi,
      address: pair.data,
      functionName: 'token1',
    }],
  }).data?.map(d => d.result);


  const reserveA = reserves?.data?.[tokens?.indexOf(currencyA.address) || 0];
  const reserveB = reserves?.data?.[tokens?.indexOf(currencyB?.address) || 0];

  const priceCurrencyA = useMemo(() => {
    if (Array.isArray(reserves.data) && reserves.data[1] > 0n) {
      return new BigNumber(reserveB?.toString() || 0).times(new BigNumber(10).pow(18 - (currencyB?.decimals || 10))).div(reserveA?.toString() || 0);
    }

    return new BigNumber(0);
  }, [reserves]);

  const priceCurrencyB = useMemo(() => {
    if (Array.isArray(reserves.data) && reserves.data[0] > 0n) {
      return new BigNumber(reserveA?.toString() || 0).div(BigNumber(reserveB?.toString() || 0).times(new BigNumber(10).pow(18 - (currencyB?.decimals || 18))));
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
