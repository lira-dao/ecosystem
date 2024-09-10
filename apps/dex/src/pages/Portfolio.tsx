import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { EthereumAddress } from '@lira-dao/web3-utils';
import InfoIcon from '@mui/icons-material/Info';
import { PieChart } from '@mui/x-charts';
import { useAccount, useBalance as useBalanceWagmi } from 'wagmi';
import BigNumber from 'bignumber.js';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { useFetchPrices } from '../hooks/usePrices';
import { useGetAmountsOut } from '../hooks/useGetAmountsOut';
import { usePools } from '../hooks/usePools';
import { usePricedPools } from '../hooks/usePricesPools';
import { useReferralRewards } from '../hooks/useReferralRewards';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useTokenStakers } from '../hooks/useTokenStakers';
import { AssetsCard } from '../components/portfolio/AssetsCard';
import { ReferralCard } from '../components/portfolio/ReferralCard';
import { muiDarkTheme as theme } from '../theme/theme';


// type View = 'liquidity' | 'farming' | 'holdings';
type View = 'assets' | 'liquidity';
type TimeFrame = '7days' | '1month' | '3months' | '6months' | '1year' | 'all';

export function Portfolio() {
  const th = useTheme();

  const between900And1150 = useMediaQuery(th.breakpoints.between(900, 1150));

  const { balances: tokensBalance } = useTokenBalances();

  const farms = useFarmingStakers();

  const pools = usePools();

  const stakers = useTokenStakers();

  const amountsOut = useGetAmountsOut([pools[0].token0?.address || '0x0', pools[0].token1?.address || '0x0'], 0n);

  const { isConnected, address } = useAccount();

  const {
    pendingRewards,
    refetchPendingRewards,
    writeHarvest,
    confirmed,
    isPending,
  } = useReferralRewards(address as EthereumAddress);

  const { data: pricesData, error: errorPricesData, isLoading } = useFetchPrices();

  const account = useAccount();
  const { data: accountBalance } = useBalanceWagmi({
    address: account.address,
  });

  const { pricedPools: assetsChartData, refetch: refetchAssetsData } = usePricedPools();

  const [showLpPositions, setShowLpPositions] = useState(false);
  // const [chartData, setChartData] = useState([]);

  const [selectedView, setSelectedView] = useState('assets');
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
    if (confirmed) {
      refetchPendingRewards();
      refetchAssetsData();
    }
  }, [confirmed, refetchPendingRewards, refetchAssetsData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (errorPricesData) {
    return <div>Error Loading Prices</div>;
  }

  const totalValue = assetsChartData.reduce((prev, curr) => prev.plus(curr.value), new BigNumber(0)).toFormat(2, 1);

  const getPriceForSymbol = (symbol: string): number => {
    const priceData = pricesData?.find((price) => price.symbol === symbol);
    return priceData ? parseFloat(priceData.price) : 0;
  };

  const totalStaking = stakers.reduce(
    (totals, staker) => {
      if (!staker.tokens || !Array.isArray(staker.tokens)) {
        console.error(`No tokens found or tokens is not an array for staker ${staker.address}`);
        return totals;
      }
  
      const stakingValue = staker.tokens.reduce((totalTokenValue, token) => {
        if (!token || !token.symbol) {
          console.error("Invalid token structure:", token);
          return totalTokenValue;
        }
  
        const tokenPrice = getPriceForSymbol(token.symbol);
  
        const stakedAmount = token.symbol === 'LDT' ? new BigNumber(staker.boostAmount.replace(/,/g, '')) : new BigNumber(staker.amount.replace(/,/g, ''));
  
        const tokenValue = stakedAmount.times(tokenPrice);

        return totalTokenValue.plus(tokenValue);
      }, new BigNumber(0));
  
      const boostAmount = new BigNumber(staker.boostAmount.replace(/,/g, ''));
      const remainingBoost = new BigNumber(staker.remainingBoost.replace(/,/g, ''));
      const boostAmountUSD = boostAmount.times(getPriceForSymbol('LDT'));
      const remainingBoostUSD = remainingBoost.times(getPriceForSymbol('LDT'));
  
      return {
        staking: totals.staking.plus(stakingValue),
        boosting: totals.boosting.plus(boostAmountUSD),
        remainingBoost: totals.remainingBoost.plus(remainingBoostUSD),
      };
    },
    {
      staking: new BigNumber(0),
      boosting: new BigNumber(0),
      remainingBoost: new BigNumber(0),
    }
  );

  const tooltipPortfolioValueContent = (
    <Box>
      <Typography variant="caption">
        The Portfolio Value is calculated as the sum of Token Balances, Liquidity Pool (LP) Tokens, Farming and Staking balances.
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', marginY: 4, paddingX: 2 }}>
      <Box>
        <Typography sx={{ typography: 'h3' }} fontWeight="bold" color="white" gutterBottom>
          MY Portfolio
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card sx={{ color: 'white', flexGrow: 1, marginBottom: '8px' }}>
            <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>              
              <Typography variant="h6" mb={1}>
                Portfolio Value
                <Tooltip title={tooltipPortfolioValueContent}>
                  <InfoIcon
                    fontSize="small"
                    sx={{ ml: 1, verticalAlign: 'middle' }}
                  />
                </Tooltip>
              </Typography>
            </Box>
            <Typography variant="h3">≃$ {totalValue}</Typography>
              {/*<Typography variant="h5" color={theme?.colors.gray155}>~$0.00</Typography>*/}

              {!isConnected && (
                <Typography variant="body2" color={theme?.colors.red400} textAlign="center" mt={2}>
                  No wallet connected. Please connect your MetaMask.
                </Typography>)}
            </CardContent>
          </Card>

          <Card sx={{ color: 'white' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6">Wallet Overview</Typography>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={showLpPositions}
                    onChange={(e) => setShowLpPositions(e.target.checked)}
                    color="primary"
                  />
                }
                label="Show LP Positions"
                sx={{ mb: 1 }}
              />

              <Box>
                {isConnected && (
                  <PieChart
                    height={400}
                    colors={[
                      '#3559fa',
                      th.colors.cyan[600],
                      th.colors.green[600],
                      '#ef9036',
                      '#dedede',
                      '#ffd926',
                      '#607AE3',
                      '#f76f1a'
                    ]}
                    slotProps={{
                      legend: { hidden: true },
                    }}
                    margin={{
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                    }}
                    series={[
                      {
                        data: assetsChartData.map((d) => ({
                          value: d.value,
                          label: d.symbol,
                        })),
                        valueFormatter: (v, { dataIndex }) => {
                          const { value } = assetsChartData[dataIndex];
                          return `~$ ${value.toFixed(2)}`;
                        },
                        innerRadius: 50,
                        outerRadius: 200,
                        type: 'pie',
                      },
                    ]}
                  />
                )}
                {/*{isConnected && (*/}
                {/*  <PieChart*/}
                {/*    margin={between900And1150 ? { top: 65, bottom: 220, left: 125, right: 150 } : {*/}
                {/*      top: 100,*/}
                {/*      bottom: 100,*/}
                {/*      left: 10,*/}
                {/*      right: 150,*/}
                {/*    }}*/}
                {/*    series={[*/}
                {/*      {*/}
                {/*        data: assetsChartData,*/}
                {/*        innerRadius: 30,*/}
                {/*        outerRadius: 90,*/}
                {/*      },*/}
                {/*    ]}*/}
                {/*    slotProps={{*/}
                {/*      legend: {*/}
                {/*        direction: between900And1150 ? 'row' : 'column',*/}
                {/*        position: {*/}
                {/*          vertical: between900And1150 ? 'bottom' : 'middle',*/}
                {/*          horizontal: between900And1150 ? 'middle' : 'right',*/}
                {/*        },*/}
                {/*        padding: 0,*/}
                {/*      },*/}
                {/*    }}*/}
                {/*    style={{*/}
                {/*      top: 0,*/}
                {/*      left: 0,*/}
                {/*      width: '100%',*/}
                {/*      height: '100%',*/}
                {/*      m: 0,*/}
                {/*      p: 0,*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}

                {!isConnected && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 350,
                      width: '100%',
                    }}
                  >
                    <Typography variant="body2" color="white">No tokens in your wallet</Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <ToggleButtonGroup
                color="primary"
                value={selectedView}
                onChange={handleViewChange}
                sx={{ mt: 1, marginBottom: 2 }}
                size="large"
                exclusive
                fullWidth
              >
                <ToggleButton value="assets">Assets</ToggleButton>
                <ToggleButton value="referral">Referral</ToggleButton>
              </ToggleButtonGroup>

              {isConnected && (
                <Grid container spacing={2}>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    {selectedView === 'assets' && <AssetsCard assets={assetsChartData} prices={pricesData} />}
                    {selectedView === 'referral' && <ReferralCard
                      pendingRewards={pendingRewards}
                      isPending={isPending}
                      refetchPendingRewards={refetchPendingRewards}
                      writeHarvest={writeHarvest}
                    />}
                    </Grid>
                </Grid>
              )}

              {!isConnected && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 450,
                    width: '100%',
                  }}
                >
                  <Typography variant="body2" color="white">No data to show</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* <Grid item xs={12} md={8} sx={{ marginTop: '16px' }}>
        <Card sx={{ color: 'white', height: '100%' }}>
          <CardContent>
            <Typography variant="h6" mb={1}>Liquidity Pool Tokens</Typography>
            {pools && pools.length > 0 ? (
              <List>
                {pools.map((pool, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`${pool.token0?.symbol} - ${pool.token1?.symbol}`}
                        secondary={
                          <>
                            <Typography variant="body2">
                              LP Token Symbol: <strong>{pool.symbol}</strong> <caption>{pool.address}</caption>
                            </Typography>
                            <Typography variant="body2">
                              Balance: <strong>{pool.formattedBalance}</strong>
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < pools.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography>No LP tokens found in your wallet</Typography>
            )}
          </CardContent>
        </Card>
      </Grid> */}

      <Grid container spacing={2} marginTop={4}>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4" color="white" gutterBottom>
              Your Liquidity
            </Typography>
          </Box>
          
          {/* style={{ display: 'flex', flexDirection: 'row' }} */}
          <Grid container spacing={2} >
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL LIQUIDITY (info: not in farms, not in staking)
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$0.00 - No data available
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL LIQUIDITY NOT IN FARMS: (info: liquidity + LP)
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    -
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL LP NOT IN FARMS: (info: LP)
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    -
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ marginBottom: '8px' }}>
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
            <Grid item xs={12} sm={8} md={9} sx={{ paddingBottom: '8px' }}>
              <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="white">
                    No data to show
                    {/* No Data Available */}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop={4}>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4" color="white" gutterBottom>
              Your Staking
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL STAKING
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalStaking.staking.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL BOOSTING
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalStaking.boosting.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL NOT IN STAKING
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    -
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL REMAINING BOOST
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalStaking.remainingBoost.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ paddingBottom: '8px' }}>
              <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CardContent>
                  <Typography variant="body2" color="white">
                    No data to show
                    {/* No Data Available */}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
