import { useWriteContract } from 'wagmi';
import { erc20Abi } from '@lira-dao/web3-utils';


export function useApprove(address: `0x${string}`, spender: `0x${string}`, value: bigint) {
  const { writeContract } = useWriteContract();

  const write = () => writeContract({
    abi: erc20Abi,
    address,
    functionName: 'approve',
    args: [spender as `0x${string}`, value],
  })

  return {
    write
  };
}
