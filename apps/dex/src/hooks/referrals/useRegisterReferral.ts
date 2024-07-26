import { useChainId, useWriteContract } from 'wagmi';
import { EthereumAddress, referrals, referralsAbi } from '@lira-dao/web3-utils';
import { useWatchTransaction } from '../useWatchTransaction';


export function useRegisterReferral(referrer: string) {
  const chainId = useChainId();
  const { writeContract, data, isPending, failureReason } = useWriteContract();

  const confirmed = useWatchTransaction(data);

  return {
    confirmed,
    // @ts-ignore
    error: failureReason?.cause?.reason,
    isPending: isPending || confirmed.isLoading,
    write: () => writeContract({
      abi: referralsAbi,
      address: referrals[chainId],
      functionName: 'register',
      args: [referrer as EthereumAddress],
    }),
  };
}
