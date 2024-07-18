import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { FarmingTable } from '../components/farming/FarmingTable';
import { muiDarkTheme } from '../theme/theme';


export function Farming() {
  const farms = useFarmingStakers();
  const { isConnected } = useAccount();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box sx={{width: {xs: '100%', xl: 'auto'}, display: 'flex', flexDirection: 'column', marginY: 4, paddingX: 2}}>
        <Box>
          <Typography variant="h3" mb={4} color="white">
            Farming Pools
          </Typography>
        </Box>

        <Box>
          <FarmingTable farms={farms} isConnected={isConnected} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
