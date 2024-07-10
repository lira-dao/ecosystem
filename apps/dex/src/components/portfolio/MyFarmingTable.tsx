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
import { Farm } from '../../hooks/useFarmingStakers';
import { useNavigate } from 'react-router-dom';


interface Props {
  farms: Farm[];
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

export function MyFarmingTable({ farms, isConnected }: Props) {
  const navigate = useNavigate();
  const th = useTheme();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="pools table">
        <TableHead>
          <TableRow>
            <TableCell>Farm</TableCell>
            <TableCell align="right">Total Staked</TableCell>
            {isConnected && <TableCell align="right">LP Balance</TableCell>}
            {isConnected && <TableCell align="right">My Deposit</TableCell>}
            <TableCell align="right"><Typography><span style={{ color: th.colors.green }}>Promo</span> APR</Typography></TableCell>
            {isConnected && <TableCell align="right">Rewards</TableCell>}
            {isConnected && <TableCell align="right">Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {farms.map((farm) => (
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
              {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.balance} LP</TableCell>}
              {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.amount} LP</TableCell>}
              <TableCell
                align="right"
                sx={{ textWrap: 'nowrap' }}
              ><Typography color={th.colors.green}>{getApr(farm.tokens[0]?.symbol)}</Typography></TableCell>
              {isConnected && (
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                  {farm.rewards[0]} {farm.tokens[1]?.symbol}<br />{farm.rewards[1]} {farm.tokens[0]?.symbol}
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
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
