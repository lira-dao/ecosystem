import { useAccount } from 'wagmi';
import { Box, Typography } from '@mui/material';
import { usePools } from '../hooks/usePools';
import { PoolsTable } from '../components/pools/PoolsTable';


export function Pools() {
  const { isConnected } = useAccount();
  const pools = usePools();

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
      <Typography variant="h3" mb={4}>
        Liquidity Pools
      </Typography>

      <Box>
        <PoolsTable pools={pools} isConnected={isConnected} />
      </Box>
    </Box>
  );
}
