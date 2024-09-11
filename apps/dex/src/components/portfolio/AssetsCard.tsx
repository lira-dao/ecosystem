import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';


export function getTokenColor(symbol: string | undefined) {
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
    case 'LDT-ETH':
      return '#3A6FB0';
    case 'LDT-LIRA':
      return '#8CC63F';
    case 'LDT-WBTC':
      return '#F68B1F';
    case 'LDT-TBb':
      return '#FFA07A';
    case 'LDT-TBs':
      return '#B0C4DE';
    case 'LDT-TBg':
      return '#FFD700';
    default:
      return 'white';
  }
}

interface AssetsCardProps {
  assets: { symbol: string; price: number; balance: number; value: number }[];
}

function formatNumber(value: string | number): string {
  const numberValue = parseFloat(value.toString());
  if (isNaN(numberValue) || numberValue === 0) {
    return '0.00';
  }

  const decimals = numberValue < 0.01 ? 6 : numberValue < 0.1 ? 4 : 2;
  return `${numberValue.toFixed(decimals)}`;
}

function truncateToTwoDecimals(num: number): number {
  return Math.floor(num * 100) / 100;
}

export function AssetsCard({ assets }: AssetsCardProps) {
  return (
    <Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="assets table">
          <TableHead>
            <TableRow>
              <TableCell>Asset</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right">Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assets.map((row, i) => (
              <TableRow
                key={row.symbol || i}
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
                    aria-label={row.symbol ? `Color of ${row.symbol}` : 'Unknown token color'}
                  />{row.symbol || 'Unknown'}
                </TableCell>
                <TableCell align="right">≃$ {formatNumber(row.price)}</TableCell>
                <TableCell align="right">{row.balance || '0.00'}</TableCell>
                <TableCell align="right">≃$ {truncateToTwoDecimals(row.value) || 0}</TableCell>  {/* {row.value || '0.00'} */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
