import { useReadContract } from 'wagmi';
import { erc20Abi } from '@lira-dao/web3-utils';


export function useAllowance(address: `0x${string}`, owner?: `0x${string}`, spender?: `0x${string}`) {
  const allowance = useReadContract({
    abi: erc20Abi,
    address,
    functionName: 'allowance',
    args: [owner as `0x${string}`, spender as `0x${string}`],
    query: {
      enabled: !!address && !!owner && !!spender,
    },
  });

  return {
    ...allowance,
  };
}
