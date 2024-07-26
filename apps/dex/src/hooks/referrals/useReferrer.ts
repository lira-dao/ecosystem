import { useAccount, useChainId, useReadContract } from 'wagmi';
import { EthereumAddress, referrals, referralsAbi } from '@lira-dao/web3-utils';

export function useReferrer() {
  const chainId = useChainId();
  const account = useAccount();

  const referred = useReadContract({
    abi: referralsAbi,
    address: referrals[chainId],
    functionName: 'referred',
    args: [account.address as EthereumAddress],
  });

  console.log();

  const currentReferrer = useReadContract({
    abi: referralsAbi,
    address: referrals[chainId],
    functionName: 'referrers',
    args: [account.address as EthereumAddress],
    query: {
      enabled: referred.data === true,
    },
  });

  return {
    refetch: () => {
      referred.refetch();
      currentReferrer.refetch();
    },
    referred: referred.data || false,
    currentReferrer: currentReferrer.data || '',
  };
}
