import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { useTreasury } from '../hooks/useTreasury';
import { TreasuryTable } from '../components/treasury/TreasuriesTable';

export function Treasury() {
  const { isConnected } = useAccount();
  const treasuries = useTreasury();

  return (
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
      <Typography variant="h3" mb={4} color="white">
        Treasury Tokens
      </Typography>

      <Box>
        <TreasuryTable treasuries={treasuries} isConnected={isConnected} />
      </Box>
    </Box>
  );
}
