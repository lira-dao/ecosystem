import { Box } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { useAccount } from 'wagmi';
import { useFarmingStakers } from '../hooks/useFarmingStakers';
import { FarmingTable } from '../components/farming/FarmingTable';

export function Farming() {
  const farms = useFarmingStakers();
  const { isConnected } = useAccount();


  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="1024px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Farming</x.h1>
      </x.div>

      <Box mt={8}>
        <FarmingTable farms={farms} isConnected={isConnected} />
      </Box>
    </x.div>
  );
}
