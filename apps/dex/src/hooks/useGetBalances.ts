import { useAccount, useReadContracts } from 'wagmi';
import { dexPairV2Abi, erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { useDexPairs } from './useDexPairs';


const pool = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

const dexPair = {
  functionName: 'getReserves',
  abi: dexPairV2Abi,
} as const;

export function useGetBalances() {
  const account = useAccount();
  const dexPairs = useDexPairs();

  const contracts = Object.entries(dexPairs).map(pair => ({
    ...pool,
    args: [account.address as EthereumAddress],
    address: pair[1].address,
  }));

  const balances = useReadContracts({
    contracts,
    query: {
      enabled: !!account.address,
    },
  });

  const reservesContracts = Object.entries(dexPairs).map(pair => ({
    ...dexPair,
    address: pair[0] as EthereumAddress,
  }));

  const reserves = useReadContracts({
    contracts: reservesContracts,
  });

  return {
    data: balances.data?.map((balance, i) => ({
      balance,
      name: Object.entries(dexPairs)[i][1].symbol,
      address: Object.entries(dexPairs)[i][1].address,
      formattedBalance: new BigNumber(formatUnits(balance.result || 0n, 18)).decimalPlaces(2, 1).toString(),
    })) ?? [],
    reserves: reserves?.data?.map((reserve) => ({
      token0: reserve.result?.[0] || 0n,
      token1: reserve.result?.[1] ?? 0n,
    })),
  };
}
