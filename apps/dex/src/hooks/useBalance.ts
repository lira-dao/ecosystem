import { useAccount, useChainId, useReadContract } from 'wagmi';
import { erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';


export function useBalance(address?: EthereumAddress) {
  const account = useAccount();

  const chain = useChainId()
  console.log('chain', chain);
  return useReadContract({
    abi: erc20Abi,
    address,
    functionName: 'balanceOf',
    args: [account.address as EthereumAddress],
    query: {
      enabled: !!address && !!account.address,
    },
  });
}
