import { useAccount } from 'wagmi';
import { Box } from '@mui/material';
import { x } from '@xstyled/styled-components';
import { useTreasury } from '../hooks/useTreasury';
import { TreasuryTable } from '../components/treasury/TreasuriesTable';


export function Treasury() {
  const { isConnected } = useAccount();
  const treasuries = useTreasury();

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="1024px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Treasury Tokens</x.h1>
      </x.div>

      <Box mt={8}>
        <TreasuryTable treasuries={treasuries} isConnected={isConnected} />
      </Box>
    </x.div>
  );
}
