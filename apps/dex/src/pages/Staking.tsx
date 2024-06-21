import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { StakingTable } from '../components/staking/StakingTable';
import { muiDarkTheme } from '../theme/theme';
import { useTokenStakers } from '../hooks/useTokenStakers';


export function Staking() {
  const stakers = useTokenStakers();
  const { isConnected } = useAccount();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box sx={{width: {xs: '100%', xl: 'auto'}, display: 'flex', flexDirection: 'column', marginY: 4, paddingX: 2}}>
        <Box>
          <Typography sx={{typography: 'h3'}} fontWeight="bold" color="white">
            Stakers
          </Typography>
        </Box>

        <Box mt={4}>
          <StakingTable stakers={stakers} isConnected={isConnected} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
