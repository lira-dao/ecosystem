import { useAccount, useReadContracts } from 'wagmi';
import { addresses, erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';


const pool = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

const poolNames = [
  'LDT-WETH',
  'LDT-LIRA',
];

const poolAddresses = [
  addresses.arbitrumSepolia.ldt_weth,
  addresses.arbitrumSepolia.ldt_lira,
];

export function useGetBalances() {
  const account = useAccount();

  const { data } = useReadContracts({
    contracts: [{
      ...pool,
      address: addresses.arbitrumSepolia.ldt_weth,
      args: [account.address as EthereumAddress],
    }, {
      ...pool,
      address: addresses.arbitrumSepolia.ldt_lira,
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
      address: poolAddresses[i],
      formattedBalance: new BigNumber(formatUnits(balance.result || 0n, 18)).decimalPlaces(2, 1).toString(),
    })) ?? [],
  };
}
