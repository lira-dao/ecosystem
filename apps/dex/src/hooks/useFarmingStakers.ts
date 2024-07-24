import {
  Currency,
  erc20Abi,
  EthereumAddress,
  farmingSplitter,
  farmingSplitterAbi,
  farmingStakers,
  lpStakerAbi,
  Pair,
} from '@lira-dao/web3-utils';
import { useDexPairs } from './useDexPairs';
import { useAccount, useChainId, useReadContract, useReadContracts } from 'wagmi';
import { getCurrencyByAddress } from '../utils';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';


export interface Farm {
  address: EthereumAddress;
  amount: string;
  balance: string;
  pair: Pair
  tokens: (Currency | undefined)[],
  rewards: [string, string],
  totalStaked: string,
  apr: string,
}

export function useFarmingStakers(): Farm[] {
  const dexPairs = useDexPairs();
  const account = useAccount();
  const chainId = useChainId();

  const totalStaked = useReadContracts({
    contracts: farmingStakers[chainId].map(fs => ({
      abi: lpStakerAbi,
      address: fs.address,
      functionName: 'totalStaked',
    })),
  });

  const rewardRateTbb = useReadContract({
    abi: farmingSplitterAbi,
    address: farmingSplitter[chainId],
    functionName: 'tbbRewardRate',
  });

  const rewardRateTbs = useReadContract({
    abi: farmingSplitterAbi,
    address: farmingSplitter[chainId],
    functionName: 'tbsRewardRate',
  });

  const rewardRateTbg = useReadContract({
    abi: farmingSplitterAbi,
    address: farmingSplitter[chainId],
    functionName: 'tbgRewardRate',
  });

  const aprs = useMemo(() => {
    return [
      new BigNumber(100).times(new BigNumber(rewardRateTbb.data?.[0].toString() ?? '0').plus(rewardRateTbb.data?.[1].toString() ?? '0')).div(100000).times(365).toFormat(2, 1),
      new BigNumber(100).times(new BigNumber(rewardRateTbs.data?.[0].toString() ?? '0').plus(rewardRateTbs.data?.[1].toString() ?? '0')).div(100000).times(365).toFormat(2, 1),
      new BigNumber(100).times(new BigNumber(rewardRateTbg.data?.[0].toString() ?? '0').plus(rewardRateTbg.data?.[1].toString() ?? '0')).div(100000).times(365).toFormat(2, 1),
    ];
  }, [rewardRateTbb, rewardRateTbs, rewardRateTbg]);

  const amounts = useReadContracts({
    contracts: farmingStakers[chainId].map(fs => ({
      abi: lpStakerAbi,
      address: fs.address,
      functionName: 'stakers',
      args: [account.address],
    })),
  });

  const rewardsContracts = farmingStakers[chainId].map(fs => ({
    abi: lpStakerAbi,
    address: fs.address,
    functionName: 'pendingRewards',
    args: [account.address],
  }));

  const rewards = useReadContracts({
    contracts: rewardsContracts,
  });

  const balanceContracts = farmingStakers[chainId].map(fs => ({
    abi: erc20Abi,
    address: fs.pool,
    functionName: 'balanceOf',
    args: [account.address],
  }));

  const balances = useReadContracts({
    contracts: balanceContracts,
  });

  return farmingStakers[chainId].map((staker, i) => {
    return {
      address: staker.address,
      pair: dexPairs[staker.pool],
      // @ts-ignore
      amount: new BigNumber(amounts.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      balance: new BigNumber(balances.data?.[i].result?.toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      tokens: [
        getCurrencyByAddress(staker.tokens[0]),
        getCurrencyByAddress(staker.tokens[1]),
      ],
      apr: aprs[i],
      rewards: [
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[1].toString()).div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
      ],
      totalStaked: new BigNumber(totalStaked.data?.[i].result?.toString() ?? '0').div(new BigNumber(10).pow(18)).toFormat(2) || '',
    };
  });
}
