import React, { useEffect, useState } from 'react';
import { useAccount, useBalance as useBalanceWagmi, useChainId } from 'wagmi';
import { Box, Card, CardContent, Typography, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { muiDarkTheme, theme } from '../theme/theme';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { usePools } from '../hooks/usePools';
import { useFetchPrices } from '../hooks/usePrices';
import { MyFarmingTable } from '../components/portfolio/MyFarmingTable';
import { MyPoolsTable } from '../components/portfolio/MyPoolsTable';
import { getCurrencies, getCurrencyByAddress, getPairedCurrencies } from '../utils';


// type 
type TimeFrame = '7days' | '1month' | '3months' | '6months' | '1year' | 'all';

export function MyPortfolio() {
  // const th = useTheme();

  // const balance = useBalance(params.address as EthereumAddress);

  const chainId = useChainId();


  const farms = useFarmingStakers();
  const pools = usePools();

  const { isConnected } = useAccount();

  const { data: pricesData, error: errorPricesData, isLoading } = useFetchPrices();

  const account = useAccount();
  // console.log('account', account);

  const accountBalance = useBalanceWagmi({ address: account.address });
  // console.log('accountBalance', accountBalance.queryKey);

  console.log('getCurrencies', getCurrencies(chainId));

  const [timeFrame, setTimeFrame] = React.useState('7days');

  const handleTimeFrame = (_event: React.MouseEvent<HTMLElement>, newTimeFrame: TimeFrame) => {
    if (newTimeFrame !== null) {
      setTimeFrame(newTimeFrame);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorPricesData) {
    return <div>Error Loading Prices</div>;
  }

  // const portfolioValue = '0 ETH ~$0.00 - No data available';
  // const liquidityData = { ethValue: 'No data', periods: ['7 Days', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'] };

  const assetsChartData = [
    { value: 10, name: 'Apple' },
    { value: 15, name: 'Banana' },
    { value: 20, name: 'Cherry' }
  ];

  return (
    <ThemeProvider theme={muiDarkTheme}>
      {/* sx={{ flexGrow: 1, p: 3 }} */}
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginY: 4, paddingX: 2 }}>
        <Box>
          <Typography sx={{typography: 'h3'}} fontWeight="bold" color="white" gutterBottom>
            MY Portfolio
          </Typography>
        </Box>

        {/* <Box sx={{ flexGrow: 1 }}> */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ color: 'white', flexGrow: 1, marginBottom: '8px' }}>
              <CardContent>
                <Typography variant="h6" mb={1}>Portfolio Value</Typography>
                <Typography variant="h3">0.00 ETH</Typography>
                <Typography variant="h5" color={theme?.colors.gray155}>~$0.00</Typography>

                <Typography variant="body2" color={theme?.colors.red400} mt={2}>No tokens in your wallet</Typography>
              </CardContent>
            </Card>

            <Card sx={{ color: 'white', flexGrow: 2 }}>

              {/*  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} */}
              <CardContent>
                <Typography variant="h6">Wallet Overview</Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  height: 300, 
                  width: '100%'
                }}>
                  <PieChart
                    series={[
                      {
                        data: assetsChartData,
                        innerRadius: 30,
                        outerRadius: 100,
                        // cx: '50%',
                        // cy: '50%'
                      }
                    ]}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ color: 'white', height: '100%' }}>
              <CardContent>
                <ToggleButtonGroup
                  color='primary'
                  value={timeFrame}
                  onChange={handleTimeFrame}
                  sx={{ mt: 1 }}
                  size='large'
                  exclusive
                  fullWidth
                >
                  <ToggleButton value="7days">7 Days</ToggleButton>
                  <ToggleButton value="1month">1 Month</ToggleButton>
                  <ToggleButton value="3months">3 Months</ToggleButton>
                  <ToggleButton value="6months">6 Months</ToggleButton>
                  <ToggleButton value="1year">1 Year</ToggleButton>
                  <ToggleButton value="all">All Time</ToggleButton>
                </ToggleButtonGroup>

                <Box sx={{
                  display: 'flex',
                  alignContent: 'center',
                  alignItems: 'last baseline',
                  justifyContent: 'space-between',
                }}>
                  <Typography variant="h6">Liquidity Value</Typography>
                  <ToggleButtonGroup
                    color="primary"
                    value={timeFrame}
                    onChange={handleTimeFrame}
                    sx={{ mt: 1 }}
                    size='small'
                    exclusive
                  >
                    <ToggleButton value="7days">7 Days</ToggleButton>
                    <ToggleButton value="1month">1 Month</ToggleButton>
                    <ToggleButton value="3months">3 Months</ToggleButton>
                    <ToggleButton value="6months">6 Months</ToggleButton>
                    <ToggleButton value="1year">1 Year</ToggleButton>
                    <ToggleButton value="all">All Time</ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Typography sx={{ mt: 2 }}>Your top tokens price development over time</Typography>
                <Typography variant="body2">No data to show</Typography>

                <Box sx={{ flexGrow: 1 }}>
                  <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={100} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginTop={4}>
          {/* <Grid item xs={12}>
            <Typography variant="h3" color="white" gutterBottom>
              Portfolio
            </Typography>
          </Grid> */}
          <Grid item xs={12} sm={4} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Portfolio Value</Typography>
                <Typography variant="body1">{`0 ETH ~$0.00`}</Typography>
                {/* {!pricesData && 
                  <Typography variant="body1" color="theme.palette.primary.red">No data available</Typography>
                } */}
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent>
                <Typography variant="h6">Portfolio Value</Typography>
                <Typography variant="body1">{`0 ETH ~$0.00`}</Typography>
              </CardContent>
            </Card> */}
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Card>
              <CardContent>
                <Typography variant="h6">Wallet Overview</Typography>
                {pricesData && pricesData.map((crypto, index) => (
                  <Typography key={index} variant="body2">{`1 ${crypto.symbol} = ${parseFloat(crypto.price).toFixed(2)} USD`}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h4">Your Farms</Typography>
                <MyFarmingTable farms={farms} isConnected={isConnected} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <Card>
              <CardContent>
                {/* <Typography variant="h4">Your Farms</Typography> */}

                <Typography variant="h6">Wallet Overview</Typography>
                {pricesData && pricesData.map((crypto, index) => (
                  <Typography key={index} variant="body2">{`1 ${crypto.symbol} = ${parseFloat(crypto.price).toFixed(2)} USD`}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4">Your Pools</Typography>
                <MyPoolsTable pools={pools} isConnected={isConnected} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography variant="h4" color="white" gutterBottom>
                Your Liquidity
              </Typography>
            </Grid>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={4} md={3}>
                <Card style={{ backgroundColor: 'blue', marginBottom: '8px' }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      TOTAL LIQUIDITY (not in farms, not in staking)
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      ~$0.00 - No data available
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: 'rebeccapurple', marginBottom: '8px' }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      TOTAL LIQUIDITY NOT IN FARMS: (liquidity + LP)
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      -
                    </Typography>
                  </CardContent>
                </Card>
                <Card >
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      TOTAL LP NOT IN FARMS: (LP)
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      -
                    </Typography>
                  </CardContent>
                </Card>
                <Card style={{ backgroundColor: 'rebeccapurple' }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      ACTIVE LIQUIDITY POSITIONS:
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" gutterBottom>
                      -
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* <Grid item xs={12} sm={8} md={9}>
                <Card style={{ backgroundColor: 'rebeccapurple' }}>
                  <CardContent>
                    <Typography variant="body1" gutterBottom>
                      TODO: TradingView Graf
                    </Typography>
                  </CardContent>
                </Card>
              </Grid> */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}
