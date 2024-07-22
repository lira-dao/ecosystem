import { useAccount, useChainId, useReadContracts } from 'wagmi';
import { erc20Abi, EthereumAddress, DexPairs, Pair, dexPairV2Abi } from '@lira-dao/web3-utils';
import { getCurrencies } from '../utils';
import { useDexPairs } from './useDexPairs';
import { usePools } from '../hooks/usePools';


const dexPair = {
  functionName: 'getReserves',
  abi: dexPairV2Abi,
} as const;

const poolBalanceOf = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

export function useTokenBalances() {
  const { address } = useAccount();
  const dexPairs = useDexPairs();
  // console.log("🚀 ~ useTokenBalances ~ dexPairs:", dexPairs)

  const chainId = useChainId();
  const tokens = getCurrencies(chainId);
  // console.log("🚀 ~ useTokenBalances ~ tokens:", tokens);

  // const pairs = usePools();
  // console.log("🚀 ~ useTokenBalances ~ pairs:", Object.values(pairs))

  // const ldtPairs = Object.values(dexPairs)
  // .filter((key: Pair, index: number) => ({
  //   asd: dexPairs as any)[index]?.symbol.includes('LDT')
  // }));
  // console.log("🚀 ~ useTokenBalances ~ ldtPairs:", ldtPairs, dexPairs)


  // const ldtPairs = Object.values(dexPairs).filter((key: Pair, index: number) => ({
  //   asd: dexPairs as any)[index]?.symbol.includes('LDT')
  // }));
  // console.log("🚀 ~ ldtPairs ~ ldtPairs:", ldtPairs)

  // const ldtPairsKeys = Object.keys(dexPairs).filter(key => (dexPairs as any)[key].symbol.includes('LDT'));
  // console.log("🚀 ~ useTokenBalances ~ ldtPairsKeys:", ldtPairsKeys)

  // const ldtPairs: Pair | undefined = ldtEthPairKey ? dexPairs[ldtEthPairKey as keyof typeof dexPairs] : undefined;

  const ldtEthPairKey = Object.keys(dexPairs).find(key => {
    return ((dexPairs as any)[key]?.symbol.includes('LDT') && (dexPairs as any)[key]?.symbol.includes('ETH'));
  });
  // console.log("🚀 ~ ldtEthPairKey ~ ldtEthPairKey:", ldtEthPairKey)

  const ldtEthPair: Pair | undefined = ldtEthPairKey ? dexPairs[ldtEthPairKey as keyof typeof dexPairs] : undefined;
  // console.log("🚀 ~ useTokenBalances ~ ldtEthPair:", ldtEthPair)

  // Se il pair non esiste, gestire l'errore o il caso di mancata esistenza
  // if (!ldtEthPair) {
  //   console.error("LDT-ETH pair not found.");
  //   return { balances: [], isLoading: false, error: new Error("LDT-ETH pair not found.") };
  // }


  // const contractPairLdtEth = Object.entries(dexPairs).map(pair => ({
  //   abi: dexPairV2Abi,
  //   args: [address as EthereumAddress],
  //   address: pair[1].address,
  // }));
  // console.log("🚀 ~ contractPairLdtEth ~ contractPairLdtEth:", contractPairLdtEth)

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
  // console.log("🚀 ~ useTokenBalances ~ data:", data)

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
