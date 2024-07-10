import { ThemeProvider } from '@mui/material/styles';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { muiDarkTheme } from '../../theme/theme';
import { Pool } from '../../hooks/usePools';
import { addPoolToMetamask } from '../../utils';
import metamaskFox from '../../img/metamask-fox.svg';
import dexScreenerLogo from '../../img/dex-screener.svg';
import { useNavigate } from 'react-router-dom';


interface Props {
  pools: Pool[];
  isConnected: boolean;
}

// TODO: Evaluate MyLiquidityTable
export function MyPoolsTable({ pools, isConnected }: Props) {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <TableContainer component={Paper}>
        <Table aria-label="pools table">
          <TableHead>
            <TableRow>
              <TableCell>Pool</TableCell>
              {isConnected && <TableCell align="right">LP Balance</TableCell>}
              <TableCell align="right">Fees</TableCell>
              <TableCell align="right">Reserves</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pools.map((pool) => (
              <TableRow
                key={pool.symbol}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Box display="flex" mr={1}>
                      <img src={pool.token0?.icon} width={30} alt={`${pool.token0?.name} logo`} />
                      <img src={pool.token1?.icon} width={30} alt={`${pool.token1?.name} logo`} />
                    </Box>
                    {pool.symbol}
                  </Box>
                </TableCell>
                {isConnected && <TableCell align="right">{pool.formattedBalance}</TableCell>}
                <TableCell align="right">{pool.fee}%</TableCell>
                <TableCell align="right">
                  {pool.reserve0} {pool.token0?.symbol}<br />{pool.reserve1} {pool.token1?.symbol}
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" justifyContent="end" alignItems="center">
                    <img
                      src={metamaskFox}
                      alt="metamask icon"
                      width={30}
                      style={{ cursor: 'pointer', marginRight: 10 }}
                      onClick={() => addPoolToMetamask(pool.address)}
                    />
                    <a
                      href={`https://dexscreener.com/arbitrum/${pool.address}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ cursor: 'pointer', marginRight: 20 }}
                    >
                      <img
                        src={dexScreenerLogo}
                        alt="metamask icon"
                        width={20}
                      />
                    </a>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/swap/${pool.address}`)}
                      sx={{ marginRight: '10px' }}
                    >Swap</Button>
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/add-liquidity/${pool.address}`)}
                      sx={{ marginRight: '10px' }}
                    >Add</Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => navigate(`/remove-liquidity/${pool.address}`)}
                    >Remove</Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}
