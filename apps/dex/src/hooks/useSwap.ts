import { useAccount, useBlock, useWriteContract } from 'wagmi';
import { dexRouterV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { useGetAmountsOut } from './useGetAmountsOut';
import { useWatchTransaction } from './useWatchTransaction';
import { useDexAddresses } from './useDexAddresses';


export function useSwap(pair: [EthereumAddress, EthereumAddress], amountIn: bigint, isNativeA: boolean, isNativeB?: boolean, slippagePercentage: number = 0.5) {
  const account = useAccount();
  const block = useBlock();
  const dexAddresses = useDexAddresses();
  const { writeContract, ...rest } = useWriteContract();
  const deadline = (block.data?.timestamp ?? 0n) + 600n;

  const amountsOut = useGetAmountsOut(pair, amountIn);
  const calculateMinimumAmountOut = (amountOut: bigint): bigint => {
    const slippageFactor = 10000n - BigInt(slippagePercentage * 100);
    return (amountOut * slippageFactor) / 10000n;
  };

  const calculateMinimumAmountOut = (amountOut: bigint): bigint => {
    const slippageFactor = 10000n - BigInt(slippagePercentage * 100);
    return (amountOut * slippageFactor) / 10000n;
  };

  const getFunctionName = () => {
    if (isNativeA) {
      return 'swapExactETHForTokens';
    } else if (isNativeB) {
      return 'swapExactTokensForETH';
    }

    return 'swapExactTokensForTokens';
  };

  const write = () => {
    if (amountsOut.data && pair[1] !== '0x0') {
      const minimumAmountOut = calculateMinimumAmountOut(amountsOut.data[1]);
      if (getFunctionName() === 'swapExactETHForTokens') {
        writeContract({
          abi: dexRouterV2Abi,
          address: dexAddresses.router,
          functionName: 'swapExactETHForTokens',
          args: [
            minimumAmountOut,
            pair,
            account.address as EthereumAddress,
            deadline,
          ],
          value: amountIn,
        });
      } else {
        writeContract({
          abi: dexRouterV2Abi,
          address: dexAddresses.router,
          functionName: getFunctionName(),
          args: [
            amountIn,
            minimumAmountOut,
            pair,
            account.address as EthereumAddress,
            deadline,
          ],
        });
      }
    }
  };

  const confirmed = useWatchTransaction(rest.data);

  return {
    ...rest,
    ...confirmed,
    write,
    isPending: rest.isPending || confirmed.isLoading,
  };
}
