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
import { Staker } from '../../hooks/useTokenStakers';


interface Props {
  stakers: Staker[];
  isConnected: boolean;
}

const getApr = (symbol?: string) => {
  switch (symbol) {
    case 'TBb':
      return '73.0 %';
    case 'TBs':
      return '182.5 %';
    case 'TBg':
      return '365.0 %';
    default:
      return '365%';
  }
};

export function StakingTable({ stakers, isConnected }: Props) {
  const navigate = useNavigate();
  const th = useTheme();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="pools table">
        <TableHead>
          <TableRow>
            <TableCell>Staker</TableCell>
            <TableCell align="right">Total Staked</TableCell>
            {isConnected && <TableCell align="right">Balance</TableCell>}
            {isConnected && <TableCell align="right">My Deposit</TableCell>}
            <TableCell align="right"><Typography><span style={{ color: th.colors.green }}>Promo</span> APR</Typography></TableCell>
            {isConnected && <TableCell align="right">Rewards</TableCell>}
            {isConnected && <TableCell align="right">Boost Rewards</TableCell>}
            {isConnected && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {stakers.map((staker) => (
            <TableRow
              key={staker.address}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                <Box display="flex" alignItems="center" sx={{ textWrap: 'nowrap' }}>
                  <Box display="flex" mr={1}>
                    <img src={staker.tokens[0]?.icon} width={30} alt={`${staker.tokens[0]?.name} logo`} />
                  </Box>
                  {staker.token?.symbol}
                </Box>
              </TableCell>
              <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{staker.totalStaked}</TableCell>
              {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{staker.balance}</TableCell>}
              {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{staker.amount}</TableCell>}
              <TableCell
                align="right"
                sx={{ textWrap: 'nowrap' }}
              ><Typography color={th.colors.green}>{getApr(staker.tokens[0]?.symbol)}</Typography></TableCell>

              {isConnected && (
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                  {staker.rewards[1]} {staker.tokens[0]?.symbol}<br />{staker.rewards[0]} {staker.tokens[1]?.symbol}
                </TableCell>
              )}

              {isConnected && (
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                  {staker.boostRewards[1]} {staker.tokens[0]?.symbol}<br />{staker.boostRewards[0]} {staker.tokens[1]?.symbol}
                </TableCell>
              )}

              {isConnected && (
                <TableCell align="right">
                  <Box display="flex" justifyContent="end" alignItems="center">
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/staking/${staker.address}/harvest`)}
                      sx={{ marginRight: '10px' }}
                    >Harvest</Button>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/staking/${staker.address}/stake`)}
                      sx={{ marginRight: '10px' }}
                    >Stake</Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => navigate(`/staking/${staker.address}/unstake`)}
                    >Unstake</Button>
                  </Box>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
