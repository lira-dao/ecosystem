import { useAccount, useReadContracts } from 'wagmi';
import { addresses, erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { useDexPairs } from './useDexPairs';


const pool = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

const poolNames = [
  'LDT-WETH',
  'LDT-LIRA',
];

export function useGetBalances() {
  const account = useAccount();
  const dexPairs = useDexPairs();

  const addresses = Object.keys(dexPairs) as EthereumAddress[];

  const { data } = useReadContracts({
    contracts: [{
      ...pool,
      address: addresses[0],
      args: [account.address as EthereumAddress],
    }, {
      ...pool,
      address: addresses[1],
      args: [account.address as EthereumAddress],
    }],
    query: {
      enabled: !!account.address,
    },
  });

  return {
    data: data?.map((balance, i) => ({
      balance,
      name: poolNames[i],
      address: addresses[i],
      formattedBalance: new BigNumber(formatUnits(balance.result || 0n, 18)).decimalPlaces(2, 1).toString(),
    })) ?? [],
  };
}
