import { useAccount, useBlock, useWriteContract } from 'wagmi';
import { Currency, dexRouterV2Abi } from '@lira-dao/web3-utils';
import { useDexAddresses } from './useDexAddresses';
import { useWatchTransaction } from './useWatchTransaction';


export function useAddLiquidity(currencyA: Currency, amountA: bigint, currencyB?: Currency, amountB?: bigint) {
  const account = useAccount();
  const block = useBlock();
  const dexAddresses = useDexAddresses();
  const deadline = (block.data?.timestamp ?? 0n) + 600n;

  const { writeContract, data, isPending, reset } = useWriteContract();

  const write = () => {
    if (account.address && currencyB && amountB) {
      writeContract({
        abi: dexRouterV2Abi,
        address: dexAddresses.router,
        functionName: 'addLiquidity',
        args: [
          currencyA.address,
          currencyB.address,
          amountA,
          amountB,
          amountA - ((amountA * 10n) / 100n),
          amountB - ((amountB * 10n) / 100n),
          account.address,
          deadline,
        ],
      });
    }
  };

  const confirmed = useWatchTransaction(data)

  return {
    ...confirmed,
    write,
    reset,
    isPending: isPending || confirmed.isLoading
  };
}
