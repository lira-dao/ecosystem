import { useAccount, useBlock, useReadContracts, useSimulateContract, useWriteContract } from 'wagmi';
import { addresses, dexPairV2Abi, dexRouterV2Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { getCurrencyByAddress } from '../utils';
import { useWatchTransaction } from './useWatchTransaction';
import { useDexAddresses } from './useDexAddresses';


export function useRemoveLiquidity(address: EthereumAddress, amount: bigint) {
  const account = useAccount();
  const block = useBlock();
  const dexAddresses = useDexAddresses();
  const deadline = (block.data?.timestamp ?? 0n) + 600n;

  const info = useReadContracts({
    contracts: [{
      address,
      abi: dexPairV2Abi,
      functionName: 'getReserves',
    }, {
      address,
      abi: dexPairV2Abi,
      functionName: 'totalSupply',
    }, {
      address,
      abi: dexPairV2Abi,
      functionName: 'token0',
    }, {
      address,
      abi: dexPairV2Abi,
      functionName: 'token1',
    }],
  });

  const token0 = info?.data?.[2].result;
  const token1 = info?.data?.[3].result;

  const { writeContract, ...rest } = useWriteContract();

  const simulate = useSimulateContract({
    abi: dexRouterV2Abi,
    address: dexAddresses.router,
    functionName: 'removeLiquidity',
    args: [
      token0 as EthereumAddress,
      token1 as EthereumAddress,
      amount,
      0n,
      0n,
      account.address as EthereumAddress,
      deadline,
    ],
  });

  const amountA = simulate?.data?.result?.[0] ?? 0n;
  const amountB = simulate?.data?.result?.[1] ?? 0n;

  const amountAMin = amountA * (1000n - 5n) / 1000n;
  const amountBMin = amountB * (1000n - 5n) / 1000n;

  const write = () => {
    if (account.address) {
      writeContract({
        abi: dexRouterV2Abi,
        address: dexAddresses.router,
        functionName: 'removeLiquidity',
        args: [
          token0 as EthereumAddress,
          token1 as EthereumAddress,
          amount,
          amountAMin,
          amountBMin,
          account.address,
          deadline,
        ],
      });
    }
  };

  const confirmed = useWatchTransaction(rest.data)

  return {
    ...rest,
    ...confirmed,
    write,
    amountA,
    amountAMin,
    amountB,
    amountBMin,
    token0: getCurrencyByAddress(token0 as EthereumAddress),
    token1: getCurrencyByAddress(token1 as EthereumAddress),
    isPending: rest.isPending || confirmed.isLoading,
  };
}
