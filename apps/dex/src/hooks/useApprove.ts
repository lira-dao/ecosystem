import { useWriteContract } from 'wagmi';
import { erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';


export function useApprove(address: EthereumAddress, spender: EthereumAddress, value: bigint) {
  const { writeContract } = useWriteContract();

  const write = () => writeContract({
    abi: erc20Abi,
    address,
    functionName: 'approve',
    args: [spender, value],
  })

  return {
    write
  };
}
