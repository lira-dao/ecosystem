import { useEffect, useState } from 'react';
import { useTheme, x } from '@xstyled/styled-components';
import { Box } from '@mui/material';
import { useFetchPrices } from '../hooks/usePrices';


export function MyPortfolio() {
  const { data: pricesData, error, isLoading } = useFetchPrices();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error!</div>;
  }

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="1024px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="3xl">My Portfolio</x.h1>
      </x.div>

      <Box mt={8}>
        <x.div>
          <x.p>Recap CoinMarketCap Prices</x.p>
          <x.div>
            {pricesData && pricesData.map(crypto => (
              <x.p key={crypto.symbol}>1 {crypto.symbol} = {parseFloat(crypto.price).toFixed(parseFloat(crypto.price) < 1 ? 8 : 2)} USD</x.p>
            ))}
          </x.div>
        </x.div>
      </Box>
    </x.div>
  );
}
