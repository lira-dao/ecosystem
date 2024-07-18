import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { usePools } from '../hooks/usePools';
import { PoolsTable } from '../components/pools/PoolsTable';
import { muiDarkTheme } from '../theme/theme';
import { ThemeProvider } from '@mui/material/styles';


export function Pools() {
  const { isConnected } = useAccount();
  const pools = usePools();

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
          Liquidity Pools
        </Typography>

        <Box>
          <PoolsTable pools={pools} isConnected={isConnected} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
