import { useAccount, useBalance, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi } from '@lira-dao/web3-utils';
import { getCurrencies } from '../utils';

export function useBalances() {
  const chainId = useChainId();
  const { address } = useAccount();

  const currencies = getCurrencies(chainId).filter(c => !c.isNative);

  const erc20Contracts = currencies.map(c => ({
    abi: erc20Abi,
    address: c.address,
    functionName: 'balanceOf',
    args: [address],
  }));

  const erc20Balances = useReadContracts({
    contracts: erc20Contracts,
  });

  const balance = useBalance({
    address,
  });

  console.log('erc20Balances', erc20Balances);
  console.log('eth balance', balance);

  const balances = [
    { symbol: 'ETH', balance: (balance.data?.value ?? 0n).toString() },
  ];

  erc20Balances.data?.forEach(((b, i) => {
    balances.push({
      symbol: currencies[i].symbol,
      balance: (b.result ?? 0n).toString(),
    });
  }));

  return balances;
}
