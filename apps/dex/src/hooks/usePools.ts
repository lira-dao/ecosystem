import { useAccount, useReadContracts } from 'wagmi';
import { dexPairV2Abi, erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { useDexPairs } from './useDexPairs';
import { getCurrencyByAddress } from '../utils';


const pool = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

const dexPair = {
  functionName: 'getReserves',
  abi: dexPairV2Abi,
} as const;

export function usePools() {
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

  return balances.data?.map((balance, i) => {
    const token0 = getCurrencyByAddress(dexPairs[Object.entries(dexPairs)[i][1].address].tokens[0]);
    const token1 = getCurrencyByAddress(dexPairs[Object.entries(dexPairs)[i][1].address].tokens[1]);

    const balance0 = reserves?.data?.[i]?.result?.[0] || 0;
    const balance1 = reserves?.data?.[i]?.result?.[1] || 0;

    return {
      balance,
      name: Object.entries(dexPairs)[i][1].symbol,
      address: Object.entries(dexPairs)[i][1].address,
      formattedBalance: new BigNumber(formatUnits(balance.result || 0n, 18)).decimalPlaces(6, 1).toString(),
      token0,
      token1,
      reserve0: new BigNumber(balance0?.toString() || '0').div(new BigNumber(10).pow(token0?.decimals ?? 18)).toFormat(new BigNumber(balance0.toString()).div(new BigNumber(10).pow(token0?.decimals || 18)).lt(1) ? 6 : 2, 1),
      reserve1: new BigNumber(balance1?.toString() || '0').div(new BigNumber(10).pow(token1?.decimals ?? 18)).toFormat(new BigNumber(balance1.toString()).div(new BigNumber(10).pow(token1?.decimals || 18)).lt(1) ? 6 : 2, 1),
    };
  }) ?? [];
}
