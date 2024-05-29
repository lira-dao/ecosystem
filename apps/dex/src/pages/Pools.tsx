import { useAccount } from 'wagmi';
import { Box } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { usePools } from '../hooks/usePools';
import { PoolsTable } from '../components/pools/PoolsTable';


export function Pools() {
  const { isConnected } = useAccount();
  const pools = usePools();

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="1024px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Pools</x.h1>
      </x.div>

      <Box mt={8}>
        <PoolsTable pools={pools} isConnected={isConnected} />
      </Box>
    </x.div>
  );
}
