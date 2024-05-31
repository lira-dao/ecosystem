import { ThemeProvider } from '@mui/material/styles';
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { muiDarkTheme } from '../../theme/theme';
import { addTreasuryToken } from '../../utils';
import metamaskFox from '../../img/metamask-fox.svg';
import { useNavigate } from 'react-router-dom';
import { Treasury } from '../../hooks/useTreasury';


interface Props {
  treasuries: Treasury[];
  isConnected: boolean;
}

export function TreasuryTable({ treasuries, isConnected }: Props) {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <TableContainer component={Paper}>
        <Table aria-label="pools table">
          <TableHead>
            <TableRow>
              <TableCell>Treasury</TableCell>
              {isConnected && <TableCell align="right">Balance</TableCell>}
              <TableCell align="right">Mint Rate</TableCell>
              <TableCell align="right">Mint Fee</TableCell>
              <TableCell align="right">Burn Fee</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {treasuries.map((treasury) => (
              <TableRow
                key={treasury.symbol}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <Box display="flex" mr={1}>
                      <img src={treasury.icon} width={30} alt={`${treasury.name} logo`} />
                    </Box>
                    {treasury.symbol}
                  </Box>
                </TableCell>
                {isConnected && <TableCell align="right">{treasury.formattedBalance}</TableCell>}
                <TableCell align="right">{treasury.rate} {treasury.paired[0]}</TableCell>
                <TableCell align="right">{treasury.mintFee}%</TableCell>
                <TableCell align="right">{treasury.burnFee}%</TableCell>
                <TableCell align="right">
                  <Box display="flex" justifyContent="end" alignItems="center">
                    <img
                      src={metamaskFox}
                      alt="metamask icon"
                      width={30}
                      style={{ cursor: 'pointer', marginRight: 10 }}
                      onClick={() => addTreasuryToken(treasury)}
                    />
                    <Button
                      color="success"
                      variant="outlined"
                      onClick={() => navigate(`/treasury/${treasury.address}/mint`)}
                      sx={{ marginRight: '10px' }}
                    >Mint</Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => navigate(`/treasury/${treasury.address}/burn`)}
                    >Burn</Button>
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
