import { useAccount, useBlock, useWriteContract } from 'wagmi';
import { addresses, dexRouterV2Abi } from '@lira-dao/web3-utils';
import { useGetAmountsOut } from './useGetAmountsOut';


export function useSwap(pair: [`0x${string}`, `0x${string}`], amountIn: bigint) {
  const { writeContract, error } = useWriteContract();
  const account = useAccount();
  const block = useBlock();
  const deadline = (block.data?.timestamp ?? 0n) + 600n;

  const amountsOut = useGetAmountsOut(pair, amountIn);

  console.log('error', error);

  const write = () => {
    if (amountsOut.data) {

      writeContract({
        abi: dexRouterV2Abi,
        address: addresses.arbitrumSepolia.router as `0x${string}`,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountIn,
          amountsOut.data[1],
          pair,
          account.address as `0x${string}`,
          deadline,
        ],
      });
    }
  }

  return {
    write,
  };
}
