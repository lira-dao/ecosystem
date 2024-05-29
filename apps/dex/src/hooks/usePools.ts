import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { Currency, dexPairV2Abi, erc20Abi, EthereumAddress, Pair } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { useDexPairs } from './useDexPairs';
import { getCurrencies, getCurrencyByAddress } from '../utils';


const poolBalanceOf = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

const poolToken0 = {
  functionName: 'token0',
  abi: dexPairV2Abi,
} as const;

const poolToken1 = {
  functionName: 'token1',
  abi: dexPairV2Abi,
} as const;

const poolFees = {
  functionName: 'fee',
  abi: dexPairV2Abi,
} as const;

const dexPair = {
  functionName: 'getReserves',
  abi: dexPairV2Abi,
} as const;

export interface Pool extends Pair {
  token0: Currency | undefined;
  token1: Currency | undefined;
  formattedBalance: string;
  reserve0: string;
  reserve1: string;
  fee: string;
}

export function usePools(): Pool[] {
  const account = useAccount();
  const dexPairs = useDexPairs();
  const chainId = useChainId();
  const currencies = getCurrencies(chainId);

  const contracts = Object.entries(dexPairs).map(pair => ({
    ...poolBalanceOf,
    args: [account.address as EthereumAddress],
    address: pair[1].address,
  }));

  const balances = useReadContracts({
    contracts,
    query: {
      enabled: !!account.address,
    },
  });

  const feeContracts = Object.entries(dexPairs).map(pair => ({
    ...poolFees,
    address: pair[1].address,
  }));

  const fee = useReadContracts({
    contracts: feeContracts,
  });

  const reservesContracts = Object.entries(dexPairs).map(pair => ({
    ...dexPair,
    address: pair[0] as EthereumAddress,
  }));

  const reserves = useReadContracts({
    contracts: reservesContracts,
  });

  const tokens0Contract = Object.entries(dexPairs).map(pair => ({
    ...poolToken0,
    address: pair[0] as EthereumAddress,
  }));

  const tokens0 = useReadContracts({
    contracts: tokens0Contract,
  });

  const tokens1Contract = Object.entries(dexPairs).map(pair => ({
    ...poolToken1,
    address: pair[0] as EthereumAddress,
  }));

  const tokens1 = useReadContracts({
    contracts: tokens1Contract,
  });

  return Object.entries(dexPairs).map((pair, i) => {
    const tokens = [
      getCurrencyByAddress(tokens0.data?.[i].result as EthereumAddress),
      getCurrencyByAddress(tokens1.data?.[i].result as EthereumAddress),
    ]
      .sort((t0, t1) => {
        if (t0?.address === currencies[0].address) {
          return -1;
        } else if (t1?.address === currencies[0].address) {
          return 1;
        } else {
          return t0?.name.localeCompare(t1?.name || '') || 0;
        }
      });

    let balance0;
    let balance1;

    if (tokens0.data?.[i].result === tokens[0]?.address) {
      balance0 = reserves?.data?.[i]?.result?.[0] || 0n;
      balance1 = reserves?.data?.[i]?.result?.[1] || 0n;
    } else {
      balance0 = reserves?.data?.[i]?.result?.[1] || 0n;
      balance1 = reserves?.data?.[i]?.result?.[0] || 0n;
    }

    return {
      ...pair[1],
      token0: tokens[0],
      token1: tokens[1],
      fee: new BigNumber(fee.data?.[i].result?.toString() || '0').div(10).decimalPlaces(1, 1).toString(),
      formattedBalance: new BigNumber(formatUnits(balances.data?.[i].result || 0n, 18)).decimalPlaces(6, 1).toString(),
      reserve0: new BigNumber(balance0?.toString() || '0').div(new BigNumber(10).pow(tokens[0]?.decimals ?? 18)).toFormat(new BigNumber(balance0.toString()).div(new BigNumber(10).pow(tokens[0]?.decimals || 18)).lt(1) ? 6 : 2, 1),
      reserve1: new BigNumber(balance1?.toString() || '0').div(new BigNumber(10).pow(tokens[1]?.decimals ?? 18)).toFormat(new BigNumber(balance1.toString()).div(new BigNumber(10).pow(tokens[1]?.decimals || 18)).lt(1) ? 6 : 2, 1),
    };
  });
}
