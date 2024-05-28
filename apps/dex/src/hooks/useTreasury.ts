import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi } from '@lira-dao/web3-utils';
import { getTreasuryCurrencies } from '../utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';


const balanceOf = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

export function useTreasury() {
  const chainId = useChainId();
  const account = useAccount();
  const tokens = getTreasuryCurrencies(chainId);

  const balancesContracts = tokens.map(token => ({ ...balanceOf, address: token.address, args: [account.address] }));

  const balances = useReadContracts({ contracts: balancesContracts });

  return tokens.map((token, i) => {
    return {
      ...token,
      balance: balances.data?.[i].result || 0n,
      formattedBalance: new BigNumber(formatUnits(balances.data?.[i].result || 0n, token.decimals)).decimalPlaces(6, 1).toString(),
    };
  });
}
