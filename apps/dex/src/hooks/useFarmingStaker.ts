import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { EthereumAddress, lpStakerAbi } from '@lira-dao/web3-utils';
import { useBalance } from './useBalance';
import { useAllowance } from './useAllowance';
import { useApprove } from './useApprove';
import { parseUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { getCurrencyByAddress } from '../utils';
import { useWatchTransaction } from './useWatchTransaction';


export function useFarmingStaker(address: EthereumAddress, action: 'stake' | 'unstake' | 'harvest', amount?: string) {
  const account = useAccount();

  const lpAddress = useReadContract({
    abi: lpStakerAbi,
    address,
    functionName: 'lpToken',
  });

  const { writeContract, isPending, failureReason, data, reset, ...rest } = useWriteContract();

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

  const balance = useBalance(lpAddress.data);

  const allowance = useAllowance(lpAddress.data as EthereumAddress, address);

  const approve = useApprove(lpAddress.data as EthereumAddress, address, parseUnits(amount || '0', 18));

  const confirmed = useWatchTransaction(data);

  return {
    balance,
    allowance,
    approve,
    write,
    reset,
    confirmed: confirmed.confirmed,
    isPending: isPending || confirmed.isLoading,

    tokens: [
      getCurrencyByAddress(rewardToken1.data || '0x0'),
      getCurrencyByAddress(rewardToken2.data || '0x0'),
    ],

    // @ts-ignore
    stakeError: failureReason?.cause?.reason,

    havePendingRewards: (pendingRewards.data?.reduce((prev, curr) => prev + curr, 0n) || 0n) > 0n,
    pendingRewardsAmounts: pendingRewards.data?.map(pr => new BigNumber(pr.toString()).div(new BigNumber(10).pow(18)).toFormat(6) || '') || [],
    pendingRewards,
  };
}
