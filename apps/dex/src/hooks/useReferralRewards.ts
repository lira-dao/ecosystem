import { useEffect, useState } from 'react';
import { useChainId, useReadContract, useWriteContract } from 'wagmi';
import { referralsRewards, referralsRewardsAbi, EthereumAddress, Currency } from '@lira-dao/web3-utils';
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
  const [error, setError] = useState<string | null>(null);

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
      const filteredTokens = tokens.filter(token => token.symbol === 'LDT' || token.symbol.includes('TB'));

      const mappedRewards = filteredTokens.map((token: Currency, index: number) => ({
        address: token.address as EthereumAddress,
        icon: token.icon,
        symbol: token.symbol,
        reward: data[index] > 0 ? data[index] : BigInt(0),
      }));

      setPendingRewards(mappedRewards);
    }
  }, [data, tokens]);

  const { writeContract, data: writeData, isPending, ...rest } = useWriteContract();

  const writeHarvest = () => {
    if (address) {

      try {
        writeContract({
          abi: referralsRewardsAbi,
          address: referralRewardAddress as EthereumAddress,
          functionName: 'harvest',
          args: [],
        });
      } catch (error) {
        setError((error as Error).message);
      }
    }
  };

  const confirmed = useWatchTransaction(writeData);

  return {
    pendingRewards,
    refetchPendingRewards: refetch,
    writeHarvest,
    ...rest,
    ...confirmed,
    isPending: isPending || confirmed.isLoading,
    error
  };
}
