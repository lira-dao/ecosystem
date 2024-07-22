import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { getCurrencies } from '../utils';

export function useTokenBalances() {
  const { address } = useAccount();
  const chainId = useChainId();
  const tokens = getCurrencies(chainId);
  console.log("🚀 ~ useTokenBalances ~ tokens:", tokens)

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

  console.log(tokens);

  const proofbalances = data ? tokens.map((token, index) => ({
    symbol: token.symbol,
    balance: data[index] ? data[index].result : 0n,
  })) : [];
  console.log("🚀 ~ proofbalances ~ proofbalances:", proofbalances)

  const balances = data ? tokens.map((token, index) => ({
    symbol: token.symbol,
    balance: data[index] ? data[index].result : 0n,
  })) : [];

  return {
    balances,
    isLoading,
    error
  };
}
