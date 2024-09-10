import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Asset } from '../../hooks/usePricesPools';
import { Price } from '../../hooks/usePrices';


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
  prices?: Price[];
}

function formatNumber(value: string | number): string {
  const numberValue = parseFloat(value.toString());
  if (isNaN(numberValue) || numberValue === 0) {
    return '0.00';
  }

  const decimals = numberValue < 0.01 ? 6 : 2;
  return `${numberValue.toFixed(decimals)}`;
}

export function AssetsCard({ assets, prices }: AssetsCardProps) {

  const getPriceForSymbol = (symbol: string | undefined): string => {
    const priceData = prices?.find((price) => price.symbol === symbol);
    return priceData ? formatNumber(priceData.price) : '0.00';
  };

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
                <TableCell align="right">≃$ {getPriceForSymbol(row.symbol)}</TableCell>
                <TableCell align="right">{row.formattedBalance || '0.00'}</TableCell>
                <TableCell align="right">≃$ {row.formattedValue || '0.00'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
