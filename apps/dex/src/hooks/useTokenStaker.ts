import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { EthereumAddress, lpStakerAbi, tokenStakerAbi } from '@lira-dao/web3-utils';
import { useBalance } from './useBalance';
import { useAllowance } from './useAllowance';
import { useApprove } from './useApprove';
import { parseUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { getCurrencyByAddress } from '../utils';
import { useWatchTransaction } from './useWatchTransaction';


export function useTokenStaker(stakers: string, address: EthereumAddress, action: 'stake' | 'unstake' | 'harvest', amount?: string) {
  const account = useAccount();
  const { writeContract, isPending, failureReason, data, reset, error, isError } = useWriteContract();

  const stakedAmount = useReadContract({
    abi: lpStakerAbi,
    address: address,
    functionName: 'stakers',
    args: [account.address as EthereumAddress],
  });

  const token = useReadContract({
    abi: stakers === 'farming' ? lpStakerAbi : tokenStakerAbi,
    address,
    functionName: stakers === 'farming' ? 'lpToken' : 'token',
  });

  const write = () => writeContract({
    abi: lpStakerAbi,
    address,
    functionName: action,
    args: action !== 'harvest' ? [parseUnits(amount || '0', 18)] : [],
  });

  const pendingRewards = useReadContract({
    abi: lpStakerAbi,
    address: address,
    functionName: 'pendingRewards',
    args: [account.address as EthereumAddress],
  });

  const rewardToken1 = useReadContract({
    abi: lpStakerAbi,
    address: address,
    functionName: 'rewardToken1',
  });

  const rewardToken2 = useReadContract({
    abi: lpStakerAbi,
    address: address,
    functionName: 'rewardToken2',
  });

  const balance = useBalance(token.data);

  const allowance = useAllowance(token.data as EthereumAddress, address);

  const approve = useApprove(token.data as EthereumAddress, address, parseUnits(amount || '0', 18));

  const confirmed = useWatchTransaction(data);

  return {
    balance,
    allowance,
    approve,
    write,
    reset,
    confirmed: confirmed.confirmed,
    isPending: isPending || confirmed.isLoading,

    stakedAmount: new BigNumber(stakedAmount.data?.[0].toString() || '0').div(new BigNumber(10).pow(18)).toFormat(2, 1),
    token: getCurrencyByAddress(token.data || '0x0'),

    tokens: [
      getCurrencyByAddress(rewardToken1.data || '0x0'),
      getCurrencyByAddress(rewardToken2.data || '0x0'),
    ],

    // @ts-ignore
    stakeError: failureReason?.cause?.reason,

    havePendingRewards: (pendingRewards.data?.reduce((prev, curr) => prev + curr, 0n) || 0n) > 0n,
    pendingRewardsAmounts: pendingRewards.data?.map(pr => new BigNumber(pr.toString()).div(new BigNumber(10).pow(18)).toFormat(18) || '') || [],
    pendingRewards,
    error,
    isError,
  };
}
