import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import BigNumber from 'bignumber.js';
import { Farm } from '../../hooks/useFarmingStakers';


interface Props {
  farms: Farm[];
  isConnected: boolean;
  getTokenPrice: (symbol: string) => number;
  getLpPrice: (address: string) => number;
}

export function FarmingTable({ farms, isConnected, getTokenPrice, getLpPrice }: Props) {
  const navigate = useNavigate();
  const th = useTheme();

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 350, overflowY: 'auto' }}>
      <Table stickyHeader aria-label="your farming table">
        <TableHead>
          <TableRow>
            <TableCell>Farm</TableCell>
            <TableCell align="right">Total Staked</TableCell>
            {isConnected && <TableCell align="right">My Deposit</TableCell>}
            {isConnected && <TableCell align="right">My Deposit Value</TableCell>}
            {isConnected && <TableCell align="right">My Pool Share (%)</TableCell>}
            {!isConnected && <TableCell align="right">Estimate Daily APR</TableCell>}
            <TableCell align="right"><Typography><span style={{ color: th.colors.green[400] }}>Promo</span> APR</Typography></TableCell>
            {isConnected && <TableCell align="right">Rewards</TableCell>}
            {isConnected && <TableCell align="right">Rewards Value</TableCell>}
            {isConnected && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {farms.map((farm) => {
            const pair = farm.pair;
            const lpPrice = getLpPrice(pair.address);
            const farmBalance = new BigNumber(farm.amount || 0);
            const totalStakedValue = farmBalance.multipliedBy(lpPrice);

            const reward0Price = getTokenPrice(farm.tokens[1]?.symbol || '');
            const reward1Price = getTokenPrice(farm.tokens[0]?.symbol || '');

            const reward0Value = new BigNumber(farm.rewards[0] || 0).multipliedBy(reward0Price);
            const reward1Value = new BigNumber(farm.rewards[1] || 0).multipliedBy(reward1Price);

            const totalRewardsValue = reward0Value.plus(reward1Value);

            const totalStaked = new BigNumber(farm.totalStaked || 0);
            const poolShare = totalStaked.isGreaterThan(0) ? farmBalance.dividedBy(totalStaked).multipliedBy(100).toFixed(2) : '0';

            return (
              <TableRow
                key={farm.pair.symbol}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center" sx={{ textWrap: 'nowrap' }}>
                    <Box display="flex" mr={1}>
                      <img src={farm.tokens[1]?.icon} width={30} alt={`${farm.tokens[0]?.name} logo`} />
                      <img src={farm.tokens[0]?.icon} width={30} alt={`${farm.tokens[1]?.name} logo`} />
                    </Box>
                    {farm.pair.symbol}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.totalStaked} LP</TableCell>
                {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.amount} LP</TableCell>}
                {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>≈$ {totalStakedValue.toFixed(2)}</TableCell>}
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{poolShare} %</TableCell>
                )}
                {!isConnected && <TableCell align="right">{(new BigNumber(farm.apr).div(365)).toFixed(2)} %</TableCell>}
                <TableCell
                  align="right"
                  sx={{ textWrap: 'nowrap' }}
                >
                  <Typography color={th.colors.green[400]}>{farm.apr} %</Typography>
                </TableCell>
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    {farm.rewards[0]} {farm.tokens[1]?.symbol}<br />{farm.rewards[1]} {farm.tokens[0]?.symbol}
                  </TableCell>
                )}
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    ≈$ {totalRewardsValue.isGreaterThan(0) ? totalRewardsValue.toFixed(2) : '0'}
                  </TableCell>
                )}

                {isConnected && (
                  <TableCell align="right">
                    <Box display="flex" justifyContent="end" alignItems="center">
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={() => navigate(`/farming/${farm.address}/harvest`)}
                        sx={{ marginRight: '10px' }}
                      >Harvest</Button>
                      <Button
                        color="success"
                        variant="outlined"
                        onClick={() => navigate(`/farming/${farm.address}/stake`)}
                        sx={{ marginRight: '10px' }}
                      >Stake</Button>
                      <Button
                        color="error"
                        variant="outlined"
                        onClick={() => navigate(`/farming/${farm.address}/unstake`)}
                      >Unstake</Button>
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
