import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Asset } from '../../hooks/usePricesPools';


function getTokenColor(symbol: string | undefined) {
  switch (symbol) {
    case 'ETH':
      return '#3559fa';
    case 'LDT':
      return '#00b6b4';
    case 'LIRA':
      return '#63b000';
    case 'TBb':
      return '#ef9036';
    case 'TBs':
      return '#dedede';
    case 'TBg':
      return '#ffd926';
    case 'WETH':
      return '#607AE3';
    case 'WBTC':
      return '#f76f1a';
    default:
      return 'white';
  }
}

interface AssetsCardProps {
  assets: Asset[];
}

export function AssetsCard({ assets }: AssetsCardProps) {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((row, i) => (
              <TableRow
                key={row.symbol}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'block',
                      width: 18,
                      height: 18,
                      backgroundColor: getTokenColor(row.symbol),
                      marginRight: 10,
                    }}
                  />{row.symbol}
                </TableCell>
                <TableCell align="right">{row.formattedBalance}</TableCell>
                <TableCell align="right">≃$ {row.formattedValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
