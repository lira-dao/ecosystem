import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { useTokenBalances } from './useTokenBalances';
import { useFetchPrices } from './usePrices';
import { useFetchLpPrices } from './useLpPrices';
import { usePools } from './usePools';
import { usePricedPools } from './usePricesPools';

export function usePortfolioBalance(showLpPositions: boolean) {

  const { pricedPools, refetch: refetchAssetsData } = usePricedPools();
  console.log("🚀 ~ usePortfolioBalance ~ pricedPools:", pricedPools);

  const { data: lpPrices } = useFetchLpPrices();
  console.log("🚀 ~ usePortfolioBalance ~ lpPrices:", lpPrices)

  const pools = usePools();

  const getLpPrice = (poolAddress: string): number => {
    const lpPriceObj = lpPrices?.find((lp) => lp.pairAddress === poolAddress);
    return lpPriceObj ? parseFloat(lpPriceObj.price) : 0;
  };

  const tokenAssets = useMemo(() => {
    if (!pricedPools) return [];

    return pricedPools.map((token) => {

      const formattedBalance = token.formattedBalance.replace(/,/g, '');

      return {
        symbol: token.symbol,
        price: token.value / parseFloat(formattedBalance),
        balance: parseFloat(formattedBalance),
        value: token.value,
      }
    });
  }, [pricedPools]);

  const lpAssets = useMemo(() => {
    if (!pools || !lpPrices) return [];

    return pools.map((pool) => {
      const lpPrice = getLpPrice(pool.address);
      const balance = parseFloat(pool.formattedBalance);
      const value = balance * lpPrice;

      return {
        symbol: `${pool.token0?.symbol}-${pool.token1?.symbol}`,
        price: lpPrice,
        balance,
        value,
      };
    });
  }, [pools, lpPrices]);

  const combinedAssets = useMemo(() => {
    return showLpPositions ? [...tokenAssets, ...lpAssets] : tokenAssets;
  }, [showLpPositions, tokenAssets, lpAssets]);

  return combinedAssets;
}
