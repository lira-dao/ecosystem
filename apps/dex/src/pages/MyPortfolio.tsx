import React, { useEffect, useState } from 'react';
import { useAccount, useBalance as useBalanceWagmi, useChainId } from 'wagmi';
import { Box, Card, CardContent, Typography, Grid, ToggleButton, ToggleButtonGroup, useMediaQuery, useTheme } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { PieChart } from '@mui/x-charts';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { getCurrencies, getCurrencyByAddress, getPairedCurrencies } from '../utils';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { usePools } from '../hooks/usePools';
import { useFetchPrices } from '../hooks/usePrices';
import { MyFarmingTable } from '../components/portfolio/MyFarmingTable';
import { MyPoolsTable } from '../components/portfolio/MyPoolsTable';
import { muiDarkTheme, theme } from '../theme/theme';


// export type AnchorX = 'left' | 'right' | 'middle';
// export type AnchorY = 'top' | 'bottom' | 'middle';

type View = 'liquidity' | 'farming' | 'holdings';
type TimeFrame = '7days' | '1month' | '3months' | '6months' | '1year' | 'all';

export function MyPortfolio() {
  const th = useTheme();

  // 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  // const isExtraSmall = useMediaQuery(th.breakpoints.down('xs'));
  const isMobile = useMediaQuery(th.breakpoints.down('md'));
  console.log("🚀 ~ Layout ~ isMobile:", isMobile);

  // const balance = useBalance(params.address as EthereumAddress);
  // console.log("🚀 ~ MyPortfolio ~ params");

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

  const [selectedView, setSelectedView] = useState('liquidity');
  const [liquidityTimeFrame, setLiquidityTimeFrame] = useState<TimeFrame>('7days');
  const [holdingsTimeFrame, setHoldingsTimeFrame] = useState<TimeFrame>('7days');

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: View) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  const handleLiquidityTimeFrameChange = (_event: React.MouseEvent<HTMLElement>, newTimeFrame: TimeFrame) => {
    if (newTimeFrame !== null) {
      setLiquidityTimeFrame(newTimeFrame);
    }
  };

  const handleHoldingsTimeFrameChange = (_event: React.MouseEvent<HTMLElement>, newTimeFrame: TimeFrame) => {
    if (newTimeFrame !== null) {
      setHoldingsTimeFrame(newTimeFrame);
    }
  };

  useEffect(() => {
    console.log("Component rendered");
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorPricesData) {
    return <div>Error Loading Prices</div>;
  }

  // const portfolioValue = '0 ETH ~$0.00 - No data available';
  // const liquidityData = { ethValue: 'No data', periods: ['7 Days', '1 Month', '3 Months', '6 Months', '1 Year', 'All Time'] };

  const assetsChartData = [
    { name: 'Apple', value: 10, label: 'Series A' },
    { name: 'Banana', value: 15, label: 'Series B' },
    { name: 'Cherry', value: 20, label: 'Series C' },
    { name: 'Apple', value: 10, label: 'Series A' },
    { name: 'Banana', value: 15, label: 'Series B' },
    { name: 'Cherry', value: 20, label: 'Series C' },
    { name: 'Apple', value: 10, label: 'Series A' },
    { name: 'Banana', value: 15, label: 'Series B' },
    { name: 'Cherry', value: 20, label: 'Series C' }
  ];

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginY: 4, paddingX: 2 }}>
        <Box>
          <Typography sx={{typography: 'h3'}} fontWeight="bold" color="white" gutterBottom>
            MY Portfolio
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card sx={{ color: 'white', flexGrow: 1, marginBottom: '8px' }}>
              <CardContent>
                <Typography variant="h6" mb={1}>Portfolio Value</Typography>
                <Typography variant="h3">0.00 ETH</Typography>
                <Typography variant="h5" color={theme?.colors.gray155}>~$0.00</Typography>

                {!isConnected && (<Typography variant="body2" color={theme?.colors.red400} textAlign="center" mt={2}>No wallet connected. Please connect your MetaMask.</Typography>)}
              </CardContent>
            </Card>

            <Card sx={{ color: 'white' }}>
              {/*  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} */}
              <CardContent>
                <Typography variant="h6">Wallet Overview</Typography>
                <Box sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 300,
                  width: '100%',
                  m: 0,
                  p: 0,
                }}>
                  {isConnected && (
                    <PieChart
                      margin={{ top: 100, bottom: 100, left: 0, right: 150 }}
                      series={[
                        {
                          data: assetsChartData,
                          innerRadius: 30,
                          outerRadius: 90,
                        }
                      ]}
                      slotProps={{
                        legend: {
                          direction: 'column',
                          position: {
                            vertical: 'middle',
                            horizontal: 'right',
                          },
                          padding: 0,
                        },
                      }}
                      style={{ 
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        m: 0,
                        p: 0
                      }}
                    />
                  )}

                  {!isConnected && (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 300,
                        width: '100%'
                      }}
                    >
                      <Typography variant="body2" color="white">No tokens in your wallet</Typography>
                    </Box>
                  )}
                </Box>
                {/* {JSON.stringify({ asd: 'sad'})} */}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={8}>
            <Card sx={{ color: 'white', height: '100%' }}>
              <CardContent>
                <ToggleButtonGroup
                  color='primary'
                  value={selectedView}
                  onChange={handleViewChange}
                  sx={{ mt: 1, marginBottom: 2 }}
                  size='large'
                  exclusive
                  fullWidth
                >
                  <ToggleButton value="liquidity">Liquidity Value</ToggleButton>
                  <ToggleButton value="farming">Earned Farming Rewards</ToggleButton>
                  <ToggleButton value="holdings">Top Holdings Prices</ToggleButton>
                </ToggleButtonGroup>

                {isConnected && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} sx={{ mt: 1 }}>
                      {selectedView === 'liquidity' && (
                        <Box sx={{
                          display: 'flex',
                          alignContent: 'center',
                          alignItems: 'last baseline',
                          justifyContent: 'space-between',
                        }}>
                          <Typography variant="body2">ETH Value of Your LPs.</Typography>
                          <ToggleButtonGroup
                            color="primary"
                            value={liquidityTimeFrame}
                            onChange={handleLiquidityTimeFrameChange}
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

                          <Box sx={{ flexGrow: 1 }}>
                            <SparkLineChart data={[2, 8, 1, 3, 7, 5, 8, 6, 7, 2, 1]} height={100} />
                          </Box>
                        </Box>
                      )}
                      {selectedView === 'farming' && (
                        <Typography variant="body2">ADA value of your total earned farming rewards for all time per epoch.</Typography>
                      )}
                      {selectedView === 'holdings' && (
                        <Box sx={{
                          display: 'flex',
                          alignContent: 'center',
                          alignItems: 'last baseline',
                          justifyContent: 'space-between',
                        }}>
                          {/* <Typography variant="h6">Top Holdings Prices Graphs</Typography> */}
                          <Typography variant="body2">Your top tokens price development over time.</Typography>
                          <ToggleButtonGroup
                            color="primary"
                            value={holdingsTimeFrame}
                            onChange={handleHoldingsTimeFrameChange}
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

                          <Box sx={{ flexGrow: 1 }}>
                            <SparkLineChart data={[1, 4, 2, 5, 7, 4, 6]} height={100} />
                          </Box>

                          <Card style={{ marginTop: '16px' }}>
                            <CardContent>
                              {/* <Typography variant="h6">Portfolio Value</Typography> */}
                              {/* <Typography variant="body1">{`0 ETH ~$0.00`}</Typography> */}
                              {!pricesData && <Typography variant="body1">No data available</Typography>}
                            </CardContent>
                          </Card>
                        </Box>
                      )}
                    </Grid>
                  </Grid>
                )}

                {/* {!isConnected && (
                  <Box sx={{
                    display: 'flex',
                    // alignContent: 'center',
                    alignItems: 'last baseline',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    <Typography variant="body2">No data to show</Typography>
                  </Box>
                )} */}

                {!isConnected && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 450,
                      width: '100%'
                    }}
                  >
                    <Typography variant="body2" color="white">No data to show</Typography>
                  </Box>
                )}

                {/* <Typography variant="body2">No data to show</Typography> */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={2} marginTop={4}>
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

                <Typography variant="h4">Wallet Overview</Typography>
                {pricesData && pricesData.map((crypto, index) => (
                  <Typography key={index} variant="body2">{`1 ${crypto.symbol} = ${parseFloat(crypto.price).toFixed(2)} USD`}</Typography>
                ))}
              </CardContent>
            </Card>
          </Grid>

          /---/

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4">Your Pools</Typography>
                <MyPoolsTable pools={pools} isConnected={isConnected} />
              </CardContent>
            </Card>
          </Grid>

          /---/

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
            </Grid>
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
}
