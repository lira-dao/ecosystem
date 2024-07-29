import {
  boostingStakerAbi,
  boostingStakers,
  Currency,
  erc20Abi,
  EthereumAddress,
  lpStakerAbi,
  stakingSplitter,
  stakingSplitterAbi,
  tokens,
  tokenStakerAbi,
  tokenStakers,
} from '@lira-dao/web3-utils';
import BigNumber from 'bignumber.js';
import { getCurrencyByAddress } from '../utils';
import { useAccount, useChainId, useReadContract, useReadContracts } from 'wagmi';
import { useMemo } from 'react';


export interface Staker {
  address: EthereumAddress;
  boosterAddress: EthereumAddress;
  amount: string;
  balance: string;
  token: Currency | undefined
  tokens: (Currency | undefined)[],
  rewards: string[],
  boostRewards: [string, string],
  totalStaked: string,
  boostAmount: string,
  maxBoost: string,
  remainingBoost: string,
  ldtBalance: string,
  apr: string,
}

export function useTokenStakers(): Staker[] {
  const chainId = useChainId();
  const account = useAccount();

  const totalStaked = useReadContracts({
    contracts: tokenStakers[chainId].map(staker => ({
      abi: lpStakerAbi,
      address: staker.address,
      functionName: 'totalStaked',
    })),
  });

  const amounts = useReadContracts({
    contracts: tokenStakers[chainId].map(staker => ({
      abi: lpStakerAbi,
      address: staker.address,
      functionName: 'stakers',
      args: [account.address],
    })),
  });

  const rewardsContracts = tokenStakers[chainId].map(staker => ({
    abi: lpStakerAbi,
    address: staker.address,
    functionName: 'pendingRewards',
    args: [account.address],
  }));

  const boostersContracts = tokenStakers[chainId].map(staker => ({
    abi: tokenStakerAbi,
    address: staker.address,
    functionName: 'boosterAddress',
  }));

  const boosters = useReadContracts({
    contracts: boostersContracts,
  });

  const boostRewardsContracts = boosters.data?.map(staker => ({
    abi: tokenStakerAbi,
    address: staker.result as EthereumAddress,
    functionName: 'pendingRewards',
    args: [account.address],
  }));

  const boostRewards = useReadContracts({
    contracts: boostRewardsContracts,
  });

  const boostAmounts = useReadContracts({
    contracts: boosters.data?.map(staker => ({
      abi: tokenStakerAbi,
      address: staker.result as EthereumAddress,
      functionName: 'stakers',
      args: [account.address],
    })),
  });

  const maxBoostAmounts = useReadContracts({
    contracts: boosters.data?.map(staker => ({
      abi: boostingStakerAbi,
      address: staker.result as EthereumAddress,
      functionName: 'getMaxBoost',
      args: [account.address],
    })),
  });

  const remainingBoostAmounts = useReadContracts({
    contracts: boosters.data?.map(staker => ({
      abi: boostingStakerAbi,
      address: staker.result as EthereumAddress,
      functionName: 'getRemainingBoost',
      args: [account.address],
    })),
  });

  const rewards = useReadContracts({
    contracts: rewardsContracts,
  });

  const balanceContracts = tokenStakers[chainId].map(staker => ({
    abi: erc20Abi,
    address: staker.token,
    functionName: 'balanceOf',
    args: [account.address],
  }));

  const balances = useReadContracts({
    contracts: balanceContracts,
  });

  const ldtBalance = useReadContract({
    abi: erc20Abi,
    address: tokens[chainId].ldt,
    functionName: 'balanceOf',
    args: [account.address as EthereumAddress],
  });

  const rewardRateTbb = useReadContract({
    abi: stakingSplitterAbi,
    address: stakingSplitter[chainId],
    functionName: 'tbbRewardRate',
  });

  const rewardRateTbs = useReadContract({
    abi: stakingSplitterAbi,
    address: stakingSplitter[chainId],
    functionName: 'tbsRewardRate',
  });

  const rewardRateTbg = useReadContract({
    abi: stakingSplitterAbi,
    address: stakingSplitter[chainId],
    functionName: 'tbgRewardRate',
  });

  const aprs = useMemo(() => {
    return [
      new BigNumber(100).times(new BigNumber(rewardRateTbb.data?.[0].toString() ?? '0').plus(rewardRateTbb.data?.[1].toString() ?? '0')).div(100000).div(2).times(365).toFormat(2, 1),
      new BigNumber(100).times(new BigNumber(rewardRateTbs.data?.[0].toString() ?? '0').plus(rewardRateTbs.data?.[1].toString() ?? '0')).div(100000).div(2).times(365).toFormat(2, 1),
      new BigNumber(100).times(new BigNumber(rewardRateTbg.data?.[0].toString() ?? '0').plus(rewardRateTbg.data?.[1].toString() ?? '0')).div(100000).div(2).times(365).toFormat(2, 1),
    ];
  }, [rewardRateTbb, rewardRateTbs, rewardRateTbg]);

  return tokenStakers[chainId].map((staker, i) => {
    return {
      address: staker.address,
      boosterAddress: boostingStakers[chainId][i].address,
      token: getCurrencyByAddress(staker.token),
      // @ts-ignore
      amount: new BigNumber(amounts.data?.[i].result?.[0].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      // @ts-ignore
      boostAmount: new BigNumber(boostAmounts.data?.[i].result?.[0].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      maxBoost: new BigNumber(maxBoostAmounts.data?.[i].result?.toString() ?? '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      remainingBoost: new BigNumber(remainingBoostAmounts.data?.[i].result?.toString() ?? '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      balance: new BigNumber(balances.data?.[i].result?.toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      ldtBalance: new BigNumber(ldtBalance.data?.toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      tokens: [
        getCurrencyByAddress(staker.tokens[0]),
        getCurrencyByAddress(staker.tokens[1]),
      ],
      apr: aprs[i],
      rewards: [
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[0].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[1].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
      ],
      boostRewards: [
        // @ts-ignore
        new BigNumber(boostRewards.data?.[i].result?.[0].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
        // @ts-ignore
        new BigNumber(boostRewards.data?.[i].result?.[1].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
      ],
      totalStaked: new BigNumber(totalStaked.data?.[i].result?.toString() ?? '0').div(new BigNumber(10).pow(18)).toFormat(2) || '',
    };
  });
}
