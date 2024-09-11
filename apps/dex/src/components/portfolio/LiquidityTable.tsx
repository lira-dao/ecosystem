import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Pool } from '../../hooks/usePools';
import { addPoolToMetamask } from '../../utils';
import metamaskFox from '../../img/metamask-fox.svg';
import dexScreenerLogo from '../../img/dex-screener.svg';
import BigNumber from 'bignumber.js';

interface Props {
  pools: Pool[];
  isConnected: boolean;
  getLpPrice: (address: string) => number;
}

export function LiquidityTable({ pools, isConnected, getLpPrice }: Props) {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: 'auto' }}>
      <Table stickyHeader aria-label="your liquidity table">
        <TableHead>
          <TableRow>
            <TableCell>Liquidity Pool</TableCell>
            <TableCell align="right">LP Price</TableCell>
            <TableCell align="right">LP Balance</TableCell>
            <TableCell align="right">LP Value</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {pools.map((pool) => {
            const lpPrice = getLpPrice(pool.address);
            const lpBalance = new BigNumber(pool.formattedBalance.replace(/,/g, ''));
            const lpValue = lpBalance.multipliedBy(lpPrice);

            return (
              <TableRow key={pool.symbol} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Box display="flex" mr={1}>
                      <img src={pool.token0?.icon} width={30} alt={`${pool.token0?.name} logo`} />
                      <img src={pool.token1?.icon} width={30} alt={`${pool.token1?.name} logo`} />
                    </Box>
                    {pool.symbol}
                  </Box>
                </TableCell>
                <TableCell align="right">≈$ {lpPrice.toFixed(2)}</TableCell>
                <TableCell align="right">{isConnected ? pool.formattedBalance : '-'}</TableCell>
                <TableCell align="right">≈$ {lpValue.isGreaterThan(0) ? lpValue.toFixed(2) : '0'}</TableCell>
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
                        alt="dexscreener icon"
                        width={20}
                      />
                    </a>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={() => navigate(`/swap/${pool.address}`)}
                      sx={{ marginRight: '10px' }}
                    >Swap</Button>
                    {isConnected && 
                      <>
                        <Button
                          color="success"
                          variant="outlined"
                          onClick={() => navigate(`/add-liquidity/${pool.address}`)}
                          sx={{ marginRight: '10px' }}
                        >Add Liquidity</Button>
                        <Button
                          color="error"
                          variant="outlined"
                          onClick={() => navigate(`/remove-liquidity/${pool.address}`)}
                        >Remove Liquidity</Button>
                      </>
                    }
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
