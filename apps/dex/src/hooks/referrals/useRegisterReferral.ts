import { useChainId, useWriteContract } from 'wagmi';
import { EthereumAddress, referrals, referralsAbi } from '@lira-dao/web3-utils';


export function useRegisterReferral(referrer: EthereumAddress) {
  const chainId = useChainId();
  const { writeContract } = useWriteContract();

  return {
    write: writeContract({
      abi: referralsAbi,
      address: referrals[chainId],
      functionName: 'register',
      args: [referrer],
    })
  }
}
