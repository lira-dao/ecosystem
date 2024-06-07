import { Currency, erc20Abi, EthereumAddress, farmingStakers, lpStakerAbi, Pair } from '@lira-dao/web3-utils';
import { useDexPairs } from './useDexPairs';
import { useAccount, useReadContracts } from 'wagmi';
import { getCurrencyByAddress } from '../utils';
import BigNumber from 'bignumber.js';


export interface Farm {
  address: EthereumAddress;
  amount: string;
  balance: string;
  pair: Pair
  tokens: (Currency | undefined)[],
  rewards: [string, string],
  totalStaked: string,
}

export function useFarmingStakers(): Farm[] {
  const dexPairs = useDexPairs();
  const account = useAccount();

  const totalStaked = useReadContracts({
    contracts: farmingStakers.map(fs => ({
      abi: lpStakerAbi,
      address: fs.address,
      functionName: 'totalStaked',
    })),
  });

  const amounts = useReadContracts({
    contracts: farmingStakers.map(fs => ({
      abi: lpStakerAbi,
      address: fs.address,
      functionName: 'stakers',
      args: [account.address],
    })),
  });

  const rewardsContracts = farmingStakers.map(fs => ({
    abi: lpStakerAbi,
    address: fs.address,
    functionName: 'pendingRewards',
    args: [account.address],
  }));

  const rewards = useReadContracts({
    contracts: rewardsContracts,
  });

  const balanceContracts = farmingStakers.map(fs => ({
    abi: erc20Abi,
    address: fs.pool,
    functionName: 'balanceOf',
    args: [account.address],
  }));

  const balances = useReadContracts({
    contracts: balanceContracts,
  });
  console.log('balances', balances);

  return farmingStakers.map((staker, i) => {
    return {
      address: staker.address,
      pair: dexPairs[staker.pool],
      // @ts-ignore
      amount: new BigNumber(amounts.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(6) || '',
      balance: new BigNumber(balances.data?.[i].result?.toString() || '0').div(new BigNumber(10).pow(18)).toFormat(6) || '',
      tokens: [
        getCurrencyByAddress(staker.tokens[0]),
        getCurrencyByAddress(staker.tokens[1]),
      ],
      rewards: [
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[0].toString()).div(new BigNumber(10).pow(18)).toFormat(6) || '',
        // @ts-ignore
        new BigNumber(rewards.data?.[i].result?.[1].toString()).div(new BigNumber(10).pow(18)).toFormat(6) || '',
      ],
      totalStaked: new BigNumber(totalStaked.data?.[i].result?.toString() ?? '0').div(new BigNumber(10).pow(18)).toFormat(6) || '',
    };
  });
}
