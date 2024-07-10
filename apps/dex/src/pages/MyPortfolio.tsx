import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { usePools } from '../hooks/usePools';
import { useFetchPrices } from '../hooks/usePrices';
import { MyFarmingTable } from '../components/portfolio/MyFarmingTable';
import { MyPoolsTable } from '../components/portfolio/MyPoolsTable';
import { muiDarkTheme } from '../theme/theme';


export function MyPortfolio() {
  const farms = useFarmingStakers();
  const pools = usePools();

  const { isConnected } = useAccount();

  const { data: pricesData, error, isLoading } = useFetchPrices();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error Loading Prices</div>;
  }

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box sx={{width: {xs: '100%', xl: 'auto'}, display: 'flex', flexDirection: 'column', marginY: 4, paddingX: 2}}>
        <Box>
          <Typography sx={{ typography: 'h3' }} fontWeight="bold" color="white" gutterBottom>
            MY Portfolio
          </Typography>
        </Box>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Portfolio Value
          </Typography>
          <Typography variant="body1">0 ETH ~$0.00 - No data available</Typography>
        </Box>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Box>
            <Typography sx={{ typography: 'h4' }} fontWeight="bold" color="white" gutterBottom>
              Wallet Overview
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ typography: 'h6' }} fontWeight="bold" color="white" gutterBottom>
              Recap CoinMarketCap Prices
            </Typography>
          </Box>
          {pricesData && pricesData.map(crypto => (
            <Typography variant="body1" key={crypto.symbol}>1 {crypto.symbol} = {parseFloat(crypto.price).toFixed(parseFloat(crypto.price) < 1 ? 8 : 2)} USD</Typography>
          ))}
        </Box>
      
        <Box sx={{ mt: 4, mb: 2 }}>
          <Box>
            <Typography sx={{typography: 'h4'}} fontWeight="bold" color="white" gutterBottom>
              Your Farms
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              MY TOTAL LIQUIDITY IN FARMS
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              ~$0.00 - No data available
            </Typography>
            <Typography variant="body1" gutterBottom>
              TOTAL LP NOT IN FARMS:
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              -
            </Typography>
            <Typography variant="body1" gutterBottom>
              ALL TIME TOTAL EARNED REWARDS
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              -
            </Typography>
            <Typography variant="body1" gutterBottom>
              TOTAL ESTIMATED REWARDS
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              -
            </Typography>
          </Box>

          <Box>
            <MyFarmingTable farms={farms} isConnected={isConnected} />
          </Box>
        </Box>

        {/* <Box mt={4}>
          <MyPoolsTable pools={pools} isConnected={isConnected} />
        </Box> */}

        <Box sx={{ mt: 4, mb: 2 }}>
          <Typography sx={{ typography: 'h4' }} fontWeight="bold" color="white">
            Your Staked
          </Typography>

          <Box>
            <Typography variant="body1" gutterBottom>
              TODO
            </Typography>
          </Box>
        </Box>

        <Box mt={4}>
          {/* <FarmingTable farms={farms} isConnected={isConnected} /> */}
        </Box>

        <Box sx={{ mt: 4, mb: 2 }}>
          <Box>
            <Typography sx={{typography: 'h4'}} fontWeight="bold" color="white" gutterBottom>
              Your Liquidity
            </Typography>
          </Box>
          <Box>
            <Typography variant="body1" gutterBottom>
              TOTAL LIQUIDITY (not in farms, not in staking)
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              ~$0.00 - No data available
            </Typography>
            <Typography variant="body1" gutterBottom>
              TOTAL LIQUIDITY NOT IN FARMS: (liquidity + LP)
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              -
            </Typography>
            <Typography variant="body1" gutterBottom>
              TOTAL LP NOT IN FARMS: (LP)
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              -
            </Typography>
            <Typography variant="body1" gutterBottom>
              ACTIVE LIQUIDITY POSITIONS:
            </Typography>
            <Typography variant="body1" fontWeight="bold" gutterBottom>
              -
            </Typography>
          </Box>
        </Box>

        <Box mt={4}>
          <MyPoolsTable pools={pools} isConnected={isConnected} />
        </Box>
      </Box>

    </ThemeProvider>
  );
}
