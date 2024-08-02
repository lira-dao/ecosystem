import { useAccount, useBalance, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi } from '@lira-dao/web3-utils';
import { getCurrencies } from '../utils';
import BigNumber from 'bignumber.js';

export interface Balance {
  symbol: string;
  balance: string;
  formattedBalance: string;
}

export function useBalances(): Balance[] {
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

  const balances = [
    {
      symbol: 'ETH',
      balance: (balance.data?.value ?? 0n).toString(),
      formattedBalance: new BigNumber((balance.data?.value ?? 0n).toString()).div(10 ** 18).toFormat(6, 1).toString(),
    },
  ];

  erc20Balances.data?.forEach(((b, i) => {
    const balance = (b.result ?? 0n).toString();

    balances.push({
      symbol: currencies[i].symbol,
      balance: (b.result ?? 0n).toString(),
      formattedBalance: new BigNumber(balance).div(10 ** currencies[i].decimals).toFormat(6, 1).toString(),
    });
  }));

  return balances;
}
