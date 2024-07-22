import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi, EthereumAddress, DexPairs, Pair, dexPairV2Abi } from '@lira-dao/web3-utils';
import { getCurrencies } from '../utils';


export function useTokenBalances() {
  const { address } = useAccount();

  const chainId = useChainId();
  const tokens = getCurrencies(chainId);

  const contracts = tokens.map(token => ({
    abi: erc20Abi,
    address: token.address as EthereumAddress,
    functionName: 'balanceOf',
    args: [address as EthereumAddress]
  }));

  const { data, error, isLoading } = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
      refetchOnWindowFocus: false
    },
  });

  const balances = data ? tokens.map((token, index) => {
    if (token.symbol !== 'ETH') {
      return {
        symbol: token.symbol,
        balance: data[index] ? data[index].result : 0n,
      }
    }
  }) : [];

  return {
    balances,
    isLoading,
    error
  };
}
