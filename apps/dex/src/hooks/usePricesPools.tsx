import { useMemo } from 'react';
import { useAccount, useBalance as useBalanceWagmi, useChainId, useReadContracts } from 'wagmi';
import { Currency, dexPairV2Abi, erc20Abi, DexPairs, EthereumAddress, Pair } from '@lira-dao/web3-utils';
import { formatUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { useDexPairs } from './useDexPairs';
import { useFetchPrices } from './usePrices';
import { useTokenBalances } from './useTokenBalances';
import { getCurrencies, getCurrencyByAddress } from '../utils';


const poolBalanceOf = {
  functionName: 'balanceOf',
  abi: erc20Abi,
} as const;

const poolToken0 = {
  functionName: 'token0',
  abi: dexPairV2Abi,
} as const;

const poolToken1 = {
  functionName: 'token1',
  abi: dexPairV2Abi,
} as const;

const poolFees = {
  functionName: 'fee',
  abi: dexPairV2Abi,
} as const;

const dexPair = {
  functionName: 'getReserves',
  abi: dexPairV2Abi,
} as const;

interface Pool {
  symbol: string | undefined;
  price: number;
}

export function usePricedPools(): Pool[] {
  const { data: externalPrices, error: errorExternalPrices, isLoading: isLoadingExternalPrices } = useFetchPrices();

  const ethPriceUSD = useMemo(() => {
    const ethData = externalPrices?.find(price => price.symbol === 'ETH');
    return ethData ? parseFloat(ethData.price) : null;
  }, [externalPrices]);

  const btcPriceUSD = useMemo(() => {
    const btcData = externalPrices?.find(price => price.symbol === 'BTC');
    return btcData ? parseFloat(btcData.price) : null;
  }, [externalPrices]);

  const account = useAccount();
  const { data: accountBalance } = useBalanceWagmi({ 
    address: account.address
  });
  
  // console.log('🚀 ~ accountBalance', accountBalance);
  const dexPairs = useDexPairs();
  const chainId = useChainId();
  const currencies = getCurrencies(chainId);
  const tokens = getCurrencies(chainId);
  const tokenBalances = useTokenBalances();

  // const tokensContracts = tokens.map(token => ({
  //   abi: erc20Abi,
  //   address: token.address as EthereumAddress,
  //   functionName: 'balanceOf',
  //   args: [account.address as EthereumAddress]
  // }));

  // const { data, error, isLoading } = useReadContracts({
  //   contracts: tokensContracts,
  //   query: {
  //     enabled: !!account.address,
  //     refetchOnWindowFocus: false
  //   },
  // });
  // console.log("🚀 ~ usePricedPools ~ data:", data)
  // console.log("🚀 ~ useTokenBalances ~ data:", data)

  const contracts = Object.entries(dexPairs).map(pair => ({
    ...poolBalanceOf,
    args: [account.address as EthereumAddress],
    address: pair[1].address,
  }));

  const balances = useReadContracts({
    contracts,
    query: {
      enabled: !!account.address,
    },
  });
  // console.log("🚀 ~ usePools ~ LP balances:", balances.data)

  const tokensContracts = tokens.map(token => ({
    abi: erc20Abi,
    address: token.address as EthereumAddress,
    functionName: 'balanceOf',
    args: [account.address as EthereumAddress]
  }));

  const { data: tokensBalance, error, isLoading } = useReadContracts({
    contracts: tokensContracts,
    query: {
      enabled: !!account.address,
      refetchOnWindowFocus: false
    },
  });

  const _balances = tokensBalance ? tokens.map((token, index) => ({
    symbol: token.symbol,
    balance: tokensBalance[index] ? tokensBalance[index].result : 0n,
  })) : [];

  // console.log("🚀 ~ usePricedPools ~ tokensBalance:", _balances)

  const feeContracts = Object.entries(dexPairs).map(pair => ({
    ...poolFees,
    address: pair[1].address,
  }));

  const fee = useReadContracts({
    contracts: feeContracts,
  });

  const reservesContracts = Object.entries(dexPairs).map(pair => ({
    ...dexPair,
    address: pair[0] as EthereumAddress,
  }));

  const reserves = useReadContracts({
    contracts: reservesContracts,
    query: { enabled: !!account.address },
  });
  console.log("🚀 ~ usePricedPools ~ reserves:", reserves.data)

  // const pools = useMemo(() => {
  //   return Object.entries(dexPairs).map(([key, pair], i) => {
  //     // const token0 = currencies.find(t => t.address === pair.token0);
  //     // const token1 = currencies.find(t => t.address === pair.token1);
  //     // const [reserve0, reserve1] = reserves.data?.[i]?.result ?? [0n, 0n];

  //     // const scaleFactor0 = new BigNumber(10).pow(token0.decimals - token1.decimals);
  //     // const scaleFactor1 = new BigNumber(10).pow(token1.decimals - token0.decimals);

  //     // const priceToken0toToken1 = reserve0 > 0n ? new BigNumber(reserve1).dividedBy(new BigNumber(reserve0)).multipliedBy(scaleFactor0) : new BigNumber(0);
  //     // const priceToken1toToken0 = reserve1 > 0n ? new BigNumber(reserve0).dividedBy(new BigNumber(reserve1)).multipliedBy(scaleFactor1) : new BigNumber(0);

  //     // return {
  //     //   ...pair,
  //     //   token0,
  //     //   token1,
  //     //   reserve0: reserve0.toString(),
  //     //   reserve1: reserve1.toString(),
  //     //   fee: (reserves.data?.[i]?.fee || '0').toString(),
  //     //   formattedBalance: 'N/A', // This should be calculated if you have balance information
  //     //   priceToken0toToken1: priceToken0toToken1.toFixed(), // or use .toString() if you prefer
  //     //   priceToken1toToken0: priceToken1toToken0.toFixed(),
  //     // };
  //   });
  // }, [dexPairs, reserves.data, currencies]);

  const tokens0Contract = Object.entries(dexPairs).map(pair => ({
    ...poolToken0,
    address: pair[0] as EthereumAddress,
  }));

  const tokens0 = useReadContracts({
    contracts: tokens0Contract,
  });

  // console.log("🚀 ~ usePricedPools ~ tokens0:", tokens0)

  const tokens1Contract = Object.entries(dexPairs).map(pair => ({
    ...poolToken1,
    address: pair[0] as EthereumAddress,
  }));

  const tokens1 = useReadContracts({
    contracts: tokens1Contract,
  });

  // console.log("🚀 ~ usePricedPools ~ tokens1:", tokens1)

  // Improve with: Calculate price LDT in ETH

  const ldtEthPairKey = Object.keys(dexPairs).find(key => {
    return ((dexPairs as any)[key]?.symbol.includes('LDT') && (dexPairs as any)[key]?.symbol.includes('ETH'));
  });
  // console.log("🚀 ~ ldtEthPairKey ~ ldtEthPairKey:", ldtEthPairKey)

  const ldtEthPair: Pair | undefined = ldtEthPairKey ? dexPairs[ldtEthPairKey as keyof typeof dexPairs] : undefined;
  // console.log("🚀 ~ useTokenBalances ~ ldtEthPair:", ldtEthPair)

  const ldtWbtcPairKey = Object.keys(dexPairs).find(key => {
    return ((dexPairs as any)[key]?.symbol.includes('LDT') && (dexPairs as any)[key]?.symbol.includes('BTC'));
  });
  // console.log("🚀 ~ ldtWbtcPairKey ~ ldtWbtcPairKey:", ldtWbtcPairKey)

  const ldtWbtcPair: Pair | undefined = ldtWbtcPairKey ? dexPairs[ldtWbtcPairKey as keyof typeof dexPairs] : undefined;
  // console.log("🚀 ~ useTokenBalances ~ ldtWbtcPair:", ldtWbtcPair)


  let ldtPriceInEth: number, ldtPriceInWbtc;

  return Object.entries(dexPairs).map((pair, i) => {

    const { address: pairAddress, symbol: pairSymbol, tokens: pairTokens } = pair[1] as any;

    console.log('pairAddress', pairAddress, pairSymbol, pairTokens, (reserves as any).data?.[i].result)

    const tokens = [
      getCurrencyByAddress(tokens0.data?.[i].result as EthereumAddress),
      getCurrencyByAddress(tokens1.data?.[i].result as EthereumAddress),
    ]
      .sort((t0, t1) => {
        if (t0?.address === currencies[0].address) {
          return -1;
        } else if (t1?.address === currencies[0].address) {
          return 1;
        } else {
          return t0?.name.localeCompare(t1?.name || '') || 0;
        }
      });

    console.log("🚀 ~ returnObject.entries ~ tokens:", tokens)

    const token0Decimals = tokens[0]?.decimals;
    const token1Decimals = tokens[1]?.decimals;

    let balance0;
    let balance1;

    if (tokens0.data?.[i].result === tokens[0]?.address) {
      balance0 = reserves?.data?.[i]?.result?.[0] || 0n;
      balance1 = reserves?.data?.[i]?.result?.[1] || 0n;
    } else {
      balance0 = reserves?.data?.[i]?.result?.[1] || 0n;
      balance1 = reserves?.data?.[i]?.result?.[0] || 0n;
    }

    const priceToken0toToken1 = token0Decimals && token1Decimals ? (new BigNumber(balance1?.toString() || 0).times(new BigNumber(10).pow(token0Decimals - (token1Decimals || 10))).div(balance0?.toString() || 0)).toNumber() : 0;
    // console.log(token0Decimals && token1Decimals ? (new BigNumber(balance1?.toString() || 0).times(new BigNumber(10).pow(token0Decimals - (token1Decimals || 10))).div(balance0?.toString() || 0)).toString() : 0)
    console.log("🚀 ~ priceToken0toToken1:", priceToken0toToken1.toString())

    const isEthPair = (tokens[1] && tokens[1].symbol === 'ETH') ? true : false;
    const isWbtcPair = (tokens[1] && tokens[1].symbol === 'WBTC') ? true : false;

    const externalPrice = isWbtcPair ? btcPriceUSD : ethPriceUSD;
    console.log(externalPrice);

    let price = 0;

    if (externalPrice) {
      if (isEthPair) {
        ldtPriceInEth = priceToken0toToken1;
        price = ldtPriceInEth * externalPrice;
      } else if (isWbtcPair) {
        price = externalPrice
      } else {
        if (typeof ldtPriceInEth === 'number') {
          price = (ldtPriceInEth / priceToken0toToken1) * externalPrice;
        }
      }
    }

    return {
      symbol: (isEthPair) ? tokens[0]?.symbol : tokens[1]?.symbol,
      price,
    };
  });
}
