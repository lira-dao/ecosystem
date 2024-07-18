import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { useTreasury } from '../hooks/useTreasury';
import { TreasuryTable } from '../components/treasury/TreasuriesTable';
import { muiDarkTheme } from '../theme/theme';
import { ThemeProvider } from '@mui/material/styles';


export function Treasury() {
  const { isConnected } = useAccount();
  const treasuries = useTreasury();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'column',
          marginY: 4,
          paddingX: 2,
        }}
      >
        <Typography sx={{ typography: 'h3', mb: 4 }} fontWeight="bold" color="white">
          Treasury Tokens
        </Typography>

        <Box>
          <TreasuryTable treasuries={treasuries} isConnected={isConnected} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
