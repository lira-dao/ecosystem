import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { muiDarkTheme } from '../../theme/theme';
import { Farm } from '../../hooks/useFarmingStakers';
import { useNavigate } from 'react-router-dom';


interface Props {
  farms: Farm[];
  isConnected: boolean;
}

export function FarmingTable({ farms, isConnected }: Props) {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <TableContainer component={Paper}>
        <Table aria-label="pools table">
          <TableHead>
            <TableRow>
              <TableCell>Farm</TableCell>
              <TableCell align="right">Total Staked</TableCell>
              {isConnected && <TableCell align="right">LP Balance</TableCell>}
              {isConnected && <TableCell align="right">My Deposit</TableCell>}
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
                      <img src={farm.tokens[0]?.icon} width={30} alt={`${farm.tokens[0]?.name} logo`} />
                      <img src={farm.tokens[1]?.icon} width={30} alt={`${farm.tokens[1]?.name} logo`} />
                    </Box>
                    {farm.pair.symbol}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.totalStaked} LP</TableCell>
                {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.balance} LP</TableCell>}
                {isConnected && <TableCell align="right" sx={{ textWrap: 'nowrap' }}>{farm.amount} LP</TableCell>}
                {isConnected && (
                  <TableCell align="right" sx={{ textWrap: 'nowrap' }}>
                    {farm.rewards[0]} {farm.tokens[0]?.symbol}<br />{farm.rewards[1]} {farm.tokens[1]?.symbol}
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
    </ThemeProvider>
  );
}
