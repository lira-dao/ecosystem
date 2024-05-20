import { useAccount, useReadContracts } from 'wagmi';
import { addresses, erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';


const pool = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

export function useGetBalances() {
  const account = useAccount();

  const { data } = useReadContracts({
    contracts: [{
      ...pool,
      address: addresses.arbitrumSepolia.ldt_weth,
      args: [account.address as EthereumAddress],
    }],
    query: {
      enabled: !!account.address,
    },
  });

  return {
    data: data?.map(balance => ({
      name: 'LDT-ETH',
      balance,
      formattedBalance: formatUnits(balance.result || 0n, 18),
    })) ?? [],
  };
}
