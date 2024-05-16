import { useReadContract } from 'wagmi';
import { addresses, dexRouterV2Abi } from '@lira-dao/web3-utils';


export function useGetAmountsOut(pair: [`0x${string}`, `0x${string}`], amount: bigint) {
  const amountsOut = useReadContract({
    abi: dexRouterV2Abi,
    address: addresses.arbitrumSepolia.router as `0x${string}`,
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
