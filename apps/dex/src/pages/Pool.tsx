import { x } from '@xstyled/styled-components';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';


export function Pool() {
  const nav = useNavigate();

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="480px">
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Positions</x.h1>
        <PrimaryButton w="auto" onClick={() => nav('/add-liquidity')}>Add Liquidity</PrimaryButton>
      </x.div>


      <x.div mt={6} border="1px solid" borderColor="white-a80" p={6} borderRadius="16px">
        <x.p textAlign="center">You do not have open positions</x.p>
      </x.div>
    </x.div>
  );
}
