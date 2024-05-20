import { useWriteContract } from 'wagmi';
import { erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { useWatchTransaction } from './useWatchTransaction';


export function useApprove(address: EthereumAddress, spender: EthereumAddress, value: bigint) {
  const { writeContract, ...rest } = useWriteContract();

  const write = () => writeContract({
    abi: erc20Abi,
    address,
    functionName: 'approve',
    args: [spender, value],
  })

  const confirmed = useWatchTransaction(rest.data)


  return {
    ...rest,
    ...confirmed,
    write,
    isLoading: rest.isPending || confirmed.isLoading,
  };
}
