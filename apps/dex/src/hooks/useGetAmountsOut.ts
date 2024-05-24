import { useReadContract } from 'wagmi';
import { dexRouterV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { useDexAddresses } from './useDexAddresses';


export function useGetAmountsOut(pair: [EthereumAddress, EthereumAddress], amount: bigint) {
  const dexAddresses = useDexAddresses();

  const amountsOut = useReadContract({
    abi: dexRouterV2Abi,
    address: dexAddresses.router,
    functionName: 'getAmountsOut',
    args: [
      amount,
      pair,
    ],
    query: {
      enabled: !!pair && !!amount,
    }
  });

  return {
    ...amountsOut,
  };
}

export function useGetAmountsIn(pair: [EthereumAddress, EthereumAddress], amount: bigint) {
  const dexAddresses = useDexAddresses();

  const amountsOut = useReadContract({
    abi: dexRouterV2Abi,
    address: dexAddresses.router,
    functionName: 'getAmountsIn',
    args: [
      amount,
      pair,
    ],
    query: {
      enabled: !!pair && !!amount,
    }
  });

  return {
    ...amountsOut,
  };
}
