import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
import { getCurrencies, getCurrencyByAddress } from '../utils';
import BigNumber from 'bignumber.js';


export function useTokenBalances() {
  const { address } = useAccount();

  const chainId = useChainId();
  const tokens = getCurrencies(chainId);

  const contracts = tokens.filter(token => !token.isNative).map(token => ({
    abi: erc20Abi,
    address: token.address as EthereumAddress,
    functionName: 'balanceOf',
    args: [address as EthereumAddress],
  }));

  const { data, error, isLoading, queryKey } = useReadContracts({
    contracts,
    query: {
      enabled: !!address,
      refetchOnWindowFocus: false,
    },
  });

  const balances = data?.map((balance, index) => {
    // @ts-ignore
    const address = queryKey[1].contracts[index].address;
    const token = getCurrencyByAddress(address);

    return {
      ...token,
      balance: data[index].result?.toString() || '0',
      formattedBalance: new BigNumber(data[index].result?.toString() || '0').div(new BigNumber(10).pow(token?.decimals || 18)).toFormat(5, 1),
    };
  }) || [];

  return {
    balances,
    isLoading,
    error,
  };
}
