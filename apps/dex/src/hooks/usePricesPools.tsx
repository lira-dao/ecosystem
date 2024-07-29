import { useMemo } from 'react';
import { useAccount, useBalance as useBalanceWagmi, useChainId, useReadContracts } from 'wagmi';
import { dexPairV2Abi, erc20Abi, EthereumAddress } from '@lira-dao/web3-utils';
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

export interface Asset {
  value: number;
  label: string;
}

export function usePricedPools(): Asset[] {
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
    address: account.address,
  });

  const dexPairs = useDexPairs();
  const chainId = useChainId();
  const currencies = getCurrencies(chainId);
  const tokens = getCurrencies(chainId);
  const tokenBalances = useTokenBalances();

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

  const tokensContracts = tokens.map(token => ({
    abi: erc20Abi,
    address: token.address as EthereumAddress,
    functionName: 'balanceOf',
    args: [account.address as EthereumAddress],
  }));

  const { data: tokensBalance, error, isLoading } = useReadContracts({
    contracts: tokensContracts,
    query: {
      enabled: !!account.address,
      refetchOnWindowFocus: false,
    },
  });

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

  const tokens0Contract = Object.entries(dexPairs).map(pair => ({
    ...poolToken0,
    address: pair[0] as EthereumAddress,
  }));

  const tokens0 = useReadContracts({
    contracts: tokens0Contract,
  });

  const tokens1Contract = Object.entries(dexPairs).map(pair => ({
    ...poolToken1,
    address: pair[0] as EthereumAddress,
  }));

  const tokens1 = useReadContracts({
    contracts: tokens1Contract,
  });

  let ldtPriceInEth: number;

  const pricedPools = Object.entries(dexPairs).map((pair, i) => {

    const { address: pairAddress, symbol: pairSymbol, tokens: pairTokens } = pair[1] as any;

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

    const isEthPair = (tokens[1] && tokens[1].symbol === 'ETH') ? true : false;
    const isWbtcPair = (tokens[1] && tokens[1].symbol === 'WBTC') ? true : false;

    const externalPrice = isWbtcPair ? btcPriceUSD : ethPriceUSD;

    let price = 0;

    if (externalPrice) {
      if (isEthPair) {
        ldtPriceInEth = priceToken0toToken1;
        price = ldtPriceInEth * externalPrice;
      } else if (isWbtcPair) {
        price = externalPrice;
      } else {
        if (typeof ldtPriceInEth === 'number') {
          price = (ldtPriceInEth / priceToken0toToken1) * externalPrice;
        }
      }
    }

    if (tokens[1]?.isNative) {
      price = ethPriceUSD ?? 0;
    }

    return {
      symbol: (isEthPair) ? tokens[0]?.symbol : tokens[1]?.symbol,
      price,
      decimals: (isEthPair && token0Decimals && token1Decimals) ? token0Decimals : token1Decimals,
    };
  });

  return tokenBalances.balances.map(token => {
    let priceInUSD;

    const balanceObj = tokenBalances.balances.find(balance => balance?.symbol === token?.symbol);
    const tokenPriced = pricedPools.find(pool => pool?.symbol === token?.symbol);

    pricedPools.push({
      decimals: 18,
      price: ethPriceUSD || 0,
      symbol: 'ETH',
    });

    if (tokenPriced) {
      const balance = balanceObj ? balanceObj.balance : (accountBalance ? accountBalance.value : 0n);

      priceInUSD = (new BigNumber(balance?.toString() || 0).dividedBy(new BigNumber(10).pow(tokenPriced.decimals || 18))).multipliedBy(tokenPriced.price).toNumber();
    }

    return {
      value: priceInUSD || 0,
      label: token?.symbol || 'ETH',
      // balance: balanceObj ? balanceObj.balance : (accountBalance ? accountBalance.value : 0n),
    };
  });
}
