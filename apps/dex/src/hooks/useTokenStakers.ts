import {
  Currency,
  erc20Abi,
  EthereumAddress, farmingStakers,
  lpStakerAbi, tokenStakerAbi,
  tokenStakers,
} from '@lira-dao/web3-utils';
import BigNumber from 'bignumber.js';
import { getCurrencyByAddress } from '../utils';
import { useAccount, useChainId, useReadContracts } from 'wagmi';


export interface Staker {
  address: EthereumAddress;
  amount: string;
  balance: string;
  token: Currency | undefined
  tokens: (Currency | undefined)[],
  rewards: [string, string],
  boostRewards: [string, string],
  totalStaked: string,
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

  console.log('boosterRewardsContracts', boostRewardsContracts);

  const boostRewards = useReadContracts({
    contracts: boostRewardsContracts,
  });

  console.log('boosters', boosters);
  console.log('boostRewards', boostRewards);

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

  return tokenStakers[chainId].map((staker, i) => {
    return {
      address: staker.address,
      token: getCurrencyByAddress(staker.token),
      // @ts-ignore
      amount: new BigNumber(amounts.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      balance: new BigNumber(balances.data?.[i].result?.toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1) || '',
      tokens: [
        getCurrencyByAddress(staker.tokens[0]),
        getCurrencyByAddress(staker.tokens[1]),
      ],
      rewards: [
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[1].toString()).div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
      ],
      boostRewards: [
        // @ts-ignore
        new BigNumber(boostRewards.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
        // @ts-ignore
        new BigNumber(boostRewards.data?.[i].result?.[1].toString()).div(new BigNumber(10).pow(18)).toFormat(4, 1) || '',
      ],
      totalStaked: new BigNumber(totalStaked.data?.[i].result?.toString() ?? '0').div(new BigNumber(10).pow(18)).toFormat(2) || '',
    };
  });
}
