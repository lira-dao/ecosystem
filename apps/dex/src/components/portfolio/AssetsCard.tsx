import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Asset } from '../../hooks/usePricesPools';


function getTokenColor(symbol: string | undefined) {
  switch (symbol) {
    case 'LDT':
      return '#02B2AF';
    case 'LIRA':
      return '#72CCFF';
    case 'TBb':
      return '#DA00FF';
    case 'TBs':
      return '#9001CB';
    case 'TBg':
      return '#2E96FF';
    case 'ETH':
      return '#3B48E0';
    case 'WBTC':
      return '#72CCFF';
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
