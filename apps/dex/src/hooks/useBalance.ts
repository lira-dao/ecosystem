import { useReadContract } from 'wagmi';
import { erc20Abi } from '@lira-dao/web3-utils';


export function useBalance(address: `0x${string}`, owner?: `0x${string}`) {
  const balance = useReadContract({
    abi: erc20Abi,
    address,
    functionName: 'balanceOf',
    args: [owner as `0x${string}`],
    query: {
      enabled: !!address && !! owner,
    }
  })

  return balance.data
}
