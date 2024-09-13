import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BigNumber from 'bignumber.js';
import { Staker } from '../../hooks/useTokenStakers';

interface Props {
  stakers: Staker[];
  isConnected: boolean;
  getTokenPrice: (symbol: string) => number;
}

export function StakingTable({ stakers, isConnected, getTokenPrice }: Props) {
  const navigate = useNavigate();
  const th = useTheme();

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 380, overflow: 'auto' }}>
      <Table stickyHeader aria-label="staking table">
        <TableHead>
          <TableRow>
            <TableCell>Staker</TableCell>
            <TableCell align="right">Total Staked</TableCell>
            <TableCell align="right">Total Staked Value</TableCell>
            {isConnected && <TableCell align="right">Boost Amount</TableCell>}
            {isConnected && <TableCell align="right">Boost Amount Value</TableCell>}
            {isConnected && <TableCell align="right">Remaining Boost</TableCell>}
            {isConnected && <TableCell align="right">My Deposit</TableCell>}
            <TableCell align="right"><Typography><span style={{ color: th.colors.green[400] }}>Promo</span> APR</Typography></TableCell>
            {isConnected && <TableCell align="right">Rewards</TableCell>}
            {isConnected && <TableCell align="right">Boost Rewards</TableCell>}
            {isConnected && <TableCell align="right">Total Rewards</TableCell>}
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stakers.map((staker) => {
            const token0Price = getTokenPrice(staker.tokens[1]?.symbol || '');
            const token1Price = getTokenPrice(staker.tokens[0]?.symbol || '');

            const stakedAmount = new BigNumber(staker.amount.replace(/,/g, ''));
            const tokenPrice = staker.token ? getTokenPrice(staker.token.symbol) : 0;
            const totalStakedValue = stakedAmount.times(tokenPrice);

            const boostAmount = new BigNumber(staker.boostAmount.replace(/,/g, ''));
            const remainingBoost = new BigNumber(staker.remainingBoost.replace(/,/g, ''));
            const totalBoostValue = boostAmount.times(token0Price);

            const totalInStaking = totalStakedValue.plus(totalBoostValue);

            const reward0Value = new BigNumber(staker.rewards?.[0] || 0).multipliedBy(token0Price);
            const reward1Value = new BigNumber(staker.rewards?.[1] || 0).multipliedBy(token1Price);

            const boostReward0Value = new BigNumber(staker.boostRewards?.[0] || 0).multipliedBy(token0Price);
            const boostReward1Value = new BigNumber(staker.boostRewards?.[1] || 0).multipliedBy(token1Price);

            const totalRewardsUSD = reward0Value.plus(reward1Value);
            const totalBoostRewardsUSD = boostReward0Value.plus(boostReward1Value);
            const totalRewards = totalRewardsUSD.plus(totalBoostRewardsUSD)

            const tokenSymbols = staker.tokens
              .filter((token) => token && token.symbol)
              .map((token) => token?.symbol)
              .join('/');

            return (
              <TableRow key={staker.address}>
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Box display="flex" mr={1}>
                      {staker.tokens.map((token, index) => (
                        token?.icon && (
                          <img key={index} src={token.icon} width={30} alt={`${token.symbol} logo`} />
                        )
                      ))}
                    </Box>
                    <Typography variant="body2" ml={1}>
                      {tokenSymbols}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                  {!isConnected ? '-' : stakedAmount.isGreaterThan(0) ? stakedAmount.toFixed(2) : '0'} {staker.tokens[0]?.symbol}
                </TableCell>
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>≈$ {totalStakedValue.isGreaterThan(0) ? totalStakedValue.toFixed(2) : '0'}</TableCell>
                {isConnected && <TableCell align="right">{boostAmount.toFixed(2)} LDT</TableCell>}
                {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>≈$ {totalBoostValue.isGreaterThan(0) ? totalBoostValue.toFixed(2) : '0'}</TableCell>}
                {isConnected && <TableCell align="right">{remainingBoost.toFixed(2)} LDT</TableCell>}
                {isConnected && <TableCell align="right">≈$ {totalInStaking.toFixed(2)}</TableCell>}
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}><Typography sx={{color: th.colors.green[400]}}> {staker.apr}</Typography></TableCell>
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    {staker.rewards[1]} {staker.tokens[0]?.symbol}<br />{staker.rewards[0]} {staker.tokens[1]?.symbol}<br />
                  </TableCell>
                )}
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    {staker.boostRewards[1]} {staker.tokens[0]?.symbol}<br />{staker.boostRewards[0]} {staker.tokens[1]?.symbol}
                  </TableCell>
                )}
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    ≈$ {totalRewards.isGreaterThan(0) ? totalRewards.toFixed(2) : '0'}
                  </TableCell>
                )}

                <TableCell align="right">
                  <Box display="flex" justifyContent="end" alignItems="center">
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => navigate(`/staking`)}
                    >
                      Staking
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
