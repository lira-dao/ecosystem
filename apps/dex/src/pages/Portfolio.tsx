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
import { useFetchLpPrices } from '../hooks/useLpPrices';
import { useGetAmountsOut } from '../hooks/useGetAmountsOut';
import { usePools } from '../hooks/usePools';
import { usePortfolioBalance } from '../hooks/usePortfolioBalance';
import { usePricedPools } from '../hooks/usePricesPools';
import { useReferralRewards } from '../hooks/useReferralRewards';
import { useTokenBalances } from '../hooks/useTokenBalances';
import { useTokenStakers } from '../hooks/useTokenStakers';
import { AssetsCard, getTokenColor } from '../components/portfolio/AssetsCard';
import { ReferralCard } from '../components/portfolio/ReferralCard';
import { LiquidityTable } from '../components/portfolio/LiquidityTable';
import { FarmingTable } from '../components/portfolio/FarmingTable';
import { muiDarkTheme as theme } from '../theme/theme';


// type View = 'liquidity' | 'farming' | 'holdings';
type View = 'assets' | 'liquidity';
type TimeFrame = '7days' | '1month' | '3months' | '6months' | '1year' | 'all';

const parseToBigNumber = (value: string) => {
  if (!value || typeof value !== 'string') {
    return new BigNumber(0);
  }
  return new BigNumber(value.replace(/[^0-9.-]+/g, ""));
};

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

  const { data: lpPrices, error: errorLpPrices, isLoading: isLpLoading } = useFetchLpPrices();

  const account = useAccount();
  const { data: accountBalance } = useBalanceWagmi({
    address: account.address,
  });

  const { pricedPools: portfolioAssetsData, refetch: refetchAssetsData } = usePricedPools();

  const [showLpPositions, setShowLpPositions] = useState(false);
  const assetsChartData = usePortfolioBalance(showLpPositions);
  // const [chartData, setChartData] = useState([]);

  const [selectedView, setSelectedView] = useState('assets');
  const [liquidityTimeFrame, setLiquidityTimeFrame] = useState<TimeFrame>('7days');
  const [holdingsTimeFrame, setHoldingsTimeFrame] = useState<TimeFrame>('7days');

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: View) => {
    if (newView !== null) {
      setSelectedView(newView);
    }
  };

  const handleLpPositionsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLpPositions(e.target.checked);
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

  const getLpPrice = (poolAddress: string): number => {
    const lpPriceObj = lpPrices?.find((lp) => lp.pairAddress === poolAddress);
    return lpPriceObj ? parseFloat(lpPriceObj.price) : 0;
  };

  const totalValue = portfolioAssetsData.reduce((prev, curr) => prev.plus(curr.value), new BigNumber(0)).toFormat(2, 1);

  const totalLpValue = pools.reduce(
    (prev, pool) => {
      const lpPrice = getLpPrice(pool.address);
      const lpValue = new BigNumber(pool.formattedBalance).times(lpPrice);
      return prev.plus(lpValue);
    },
    new BigNumber(0)
  ).toFormat(2, 1);

  const activeLiquidityPositions = isConnected
    ? [...new Set([
        ...pools.filter(pool => new BigNumber(pool.formattedBalance || 0).isGreaterThan(0)).map(pool => pool.address),
        ...farms.filter(farm => new BigNumber(farm.amount || 0).isGreaterThan(0)).map(farm => farm.pair?.address),
      ])].length
    : 0;

  const totalFarmsStakedValue = isConnected
    ? farms.reduce((total, farm) => {
        const lpPrice = getLpPrice(farm.pair?.address || '');
        const farmBalance = new BigNumber(farm.amount || 0);
        const stakedValue = farmBalance.multipliedBy(lpPrice || 0);
        
        return total.plus(stakedValue);
      }, new BigNumber(0)).toFixed(2)
    : '0.00';

  const getPriceForSymbol = (symbol: string): number => {
    const priceData = pricesData?.find((price) => price.symbol === symbol);
    return priceData ? parseFloat(priceData.price) : 0;
  };

  const totalFarmingPendingRewards = isConnected
    ? farms.reduce((total, farm) => {
        const reward0Symbol = farm.tokens[1]?.symbol || '';
        const reward1Symbol = farm.tokens[0]?.symbol || '';

        const reward0Price = getPriceForSymbol(reward0Symbol) || 0;
        const reward1Price = getPriceForSymbol(reward1Symbol) || 0;

        const reward0Value = new BigNumber(farm.rewards?.[0] || 0).multipliedBy(reward0Price);
        const reward1Value = new BigNumber(farm.rewards?.[1] || 0).multipliedBy(reward1Price);

        return total.plus(reward0Value).plus(reward1Value);
      }, new BigNumber(0)).toFormat(2, 1)
    : '0.00';

  const calculateDailyRewards = (apr: number, amount: BigNumber) => {
    if (isNaN(apr) || apr === 0 || amount.isNaN() || amount.isZero()) {
      return new BigNumber(0);
    }

    const dailyRate = apr / 100 / 365;
    const dailyRewards = amount.multipliedBy(dailyRate);
  
    return dailyRewards;
  };

  const totalEstimatedDailyRewards = farms.reduce((total, farm) => {
    const apr = isNaN(parseFloat(farm.apr)) ? 0 : parseFloat(farm.apr);
  
    const lpPrice = getLpPrice(farm.pair?.address || '') || 0;
  
    const farmAmount = new BigNumber(farm.amount || 0);
  
    const farmValue = farmAmount.multipliedBy(lpPrice);
  
    const dailyReward = calculateDailyRewards(apr, farmValue);
    console.log("APR:", apr, "Farm Amount:", farm.amount, "LP Price:", lpPrice, "Farm Investment:", farmValue.toString());

    return total.plus(dailyReward);
  }, new BigNumber(0)).toFormat(2, 1);

  const activeFarmingPositions = isConnected
    ? farms.filter(farm => new BigNumber(farm.amount || 0).isGreaterThan(0)).length
    : 0;

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
  
        const stakedAmount = token.symbol === 'LDT' ? parseToBigNumber(staker.boostAmount) : parseToBigNumber(staker.amount);

        const tokenValue = stakedAmount.times(tokenPrice);

        return totalTokenValue.plus(tokenValue);
      }, new BigNumber(0));
  
      const boostAmount = parseToBigNumber(staker.boostAmount);
      const remainingBoost = parseToBigNumber(staker.remainingBoost);
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

  const tooltipTotalLiquidityNotInFarmsContent = (
    <Box>
      <Typography variant="caption">
        The total liquidity not in farms is the sum of your liquid assets and LP tokens that are not staked in farming pools. <br/>
      </Typography>
    </Box>
  );

  const tooltipTotalLpNotInFarmsContent = (
    <Box>
      <Typography variant="caption">
        LPs in your wallet that you can deposit to a farming pool to increase your farming rewards.
      </Typography>
    </Box>
  );

  const tooltipActiveLiquidityPositionsContent = (
    <Box>
      <Typography variant="caption">
        Active Liquidity Positions represent the total number of unique LP tokens either held in your wallet or staked in farming pools. Each Liquidity Pool (LP) token is counted only once, even if it's both in your wallet and staked.
      </Typography>
    </Box>
  );

  const tooltipTotalFarmsDailyRewardContent = (
    <Box>
      <Typography variant="caption">
        Daily estimated farming rewards are calculated by multiplying your investment in farming by the APR percentage, divided by 365 (days in a year).
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
            <Typography variant="h3">
              ≃$ {parseToBigNumber(totalValue)
                  .plus(parseToBigNumber(totalLpValue))
                  .plus(parseToBigNumber(totalFarmsStakedValue))
                  .plus(parseToBigNumber(totalStaking.staking.toFixed(2)))
                  .toFormat(2, 1)}
            </Typography>

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
                    onChange={(e) => handleLpPositionsToggle(e)}
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
                    colors={assetsChartData.map((asset) => getTokenColor(asset.symbol))}
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
                    {selectedView === 'assets' && <AssetsCard assets={assetsChartData} />}
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

      <Grid container spacing={2} marginTop={4}>
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4" color="white" gutterBottom>
              Your Liquidity
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL LIQUIDITY
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {parseToBigNumber(totalValue)
                        .plus(parseToBigNumber(totalLpValue))
                        .plus(parseToBigNumber(totalFarmsStakedValue))
                        .toFormat(2, 1)}
                    {!isConnected && '- No data available'}
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    TOTAL LIQUIDITY NOT IN FARMS:
                    <Tooltip title={tooltipTotalLiquidityNotInFarmsContent}>
                      <InfoIcon
                        fontSize="small"
                        sx={{ ml: 1, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {parseToBigNumber(totalValue)
                        .plus(parseToBigNumber(totalLpValue))
                        .toFormat(2, 1)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    ~$ {totalValue} in Tokens
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="body1" gutterBottom>
                    TOTAL LP NOT IN FARMS:
                    <Tooltip title={tooltipTotalLpNotInFarmsContent}>
                      <InfoIcon
                        fontSize="small"
                        sx={{ ml: 1, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalLpValue}
                  </Typography>
                </CardContent>
              </Card>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    ACTIVE LIQUIDITY POSITIONS:
                    <Tooltip title={tooltipActiveLiquidityPositionsContent}>
                      <InfoIcon
                        fontSize="small"
                        sx={{ ml: 1, verticalAlign: 'middle' }}
                      />
                    </Tooltip>
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {activeLiquidityPositions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ paddingBottom: '8px' }}>
              <Card style={{ height: '100%', ...((pools && pools.length === 0) ? {display: 'flex', alignItems: 'center', justifyContent: 'center'} : {})}}>
                <CardContent>
                  {(pools && pools.length === 0) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body2" color="white">No Data Available</Typography>
                    </Box>
                  ) : (<LiquidityTable pools={pools} isConnected={isConnected} getLpPrice={getLpPrice} />)}
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
              Your Farming
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={4} md={3}>
              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    TOTAL STAKED IN FARMS
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalFarmsStakedValue}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    Pending Farming Rewards
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalFarmingPendingRewards}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    DAILY ESTIMATED REWARDS:
                    <Tooltip title={tooltipTotalFarmsDailyRewardContent}>
                    <InfoIcon
                      fontSize="small"
                      sx={{ ml: 1, verticalAlign: 'middle' }}
                    />
                  </Tooltip>
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    ~$ {totalEstimatedDailyRewards}
                  </Typography>
                </CardContent>
              </Card>

              <Card style={{ marginBottom: '8px' }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom>
                    ACTIVE FARMING POSITIONS
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {activeFarmingPositions}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={8} md={9} sx={{ paddingBottom: '8px' }}>
            <Card style={{ height: '100%', ...((farms && farms.length === 0) ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {})}}>
                <CardContent>
                  {(farms && farms.length === 0) ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Typography variant="body2" color="white">No Data Available</Typography>
                    </Box>
                  ) : (<FarmingTable farms={farms} isConnected={isConnected} getTokenPrice={getPriceForSymbol} getLpPrice={getLpPrice} />)}
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
