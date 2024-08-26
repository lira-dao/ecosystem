import { useEffect, useState } from 'react';
import { useChainId, useReadContract, useWriteContract } from 'wagmi';
import { referralsRewards, referralsRewardsAbi, EthereumAddress } from '@lira-dao/web3-utils';
import { useWatchTransaction } from './useWatchTransaction';
import { getCurrencies } from '../utils';


export interface TokenReward {
  address: EthereumAddress;
  icon: string;
  symbol: string;
  reward: bigint;
}

export function useReferralRewards(address: EthereumAddress | undefined) {
  const [pendingRewards, setPendingRewards] = useState<TokenReward[]>([]);

	const chainId = useChainId();
  const tokens = getCurrencies(chainId);
	const referralRewardAddress = referralsRewards[chainId];

  const { data, refetch } = useReadContract({
		abi: referralsRewardsAbi,
		address: referralRewardAddress as EthereumAddress,
		functionName: 'rewards',
		args: [address as EthereumAddress],
	});

  useEffect(() => {
    if (data && data.length > 0) {
      const mappedRewards = tokens.map((token, index) => {
        if (token.symbol === 'LDT' || token.symbol.includes('TB')) {
          return {
            address: token.address as EthereumAddress,
            icon: token.icon,
            symbol: token.symbol,
            reward: data[index] > 0 ? data[index] : BigInt(0),
          }
        }
      });

      setPendingRewards(mappedRewards.filter((reward): reward is TokenReward => reward !== undefined));
    }
  }, [data, tokens]);

  const { writeContract, data: writeData, isPending, ...rest } = useWriteContract();

  const writeHarvest = () => {
    if (address) {
      writeContract({
        abi: referralsRewardsAbi,
        address: referralRewardAddress as EthereumAddress,
        functionName: 'harvest',
        args: [],
      });
    }
  };

  const confirmed = useWatchTransaction(writeData);

  const refetchRewardsAndHarvest = async () => {
    await refetch();
    writeHarvest();
  };

  return {
    pendingRewards,
    refetchPendingRewards: refetch,
    writeHarvest,
    refetchRewardsAndHarvest,
    ...rest,
    ...confirmed,
    isPending: isPending || confirmed.isLoading,
  };
}
