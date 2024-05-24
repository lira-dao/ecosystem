import { useAccount, useBlock, useWriteContract } from 'wagmi';
import { dexRouterV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { useGetAmountsOut } from './useGetAmountsOut';
import { useWatchTransaction } from './useWatchTransaction';
import { useDexAddresses } from './useDexAddresses';


export function useSwap(pair: [EthereumAddress, EthereumAddress], amountIn: bigint) {
  const account = useAccount();
  const block = useBlock();
  const dexAddresses = useDexAddresses();
  const { writeContract, ...rest } = useWriteContract();
  const deadline = (block.data?.timestamp ?? 0n) + 600n;

  const amountsOut = useGetAmountsOut(pair, amountIn);

  const write = () => {
    if (amountsOut.data && pair[1] !== '0x0') {
      writeContract({
        abi: dexRouterV2Abi,
        address: dexAddresses.router,
        functionName: 'swapExactTokensForTokens',
        args: [
          amountIn,
          amountsOut.data[1],
          pair,
          account.address as EthereumAddress,
          deadline,
        ],
      });
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
