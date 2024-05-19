import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';


export function useAllowance(address: EthereumAddress, spender: EthereumAddress) {
  const account = useAccount();

  const allowance = useReadContract({
    abi: erc20Abi,
    address,
    functionName: 'allowance',
    args: [account.address as EthereumAddress, spender],
    query: {
      enabled: !!address && !!account.address && !!spender,
    },
  });

  return {
    ...allowance,
  };
}
