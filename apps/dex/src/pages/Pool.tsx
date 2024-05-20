import { x } from '@xstyled/styled-components';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useGetBalances } from '../hooks/useGetBalances';


export function Pool() {
  const nav = useNavigate();
  const { data } = useGetBalances();

  console.log('balances', data);

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="480px">
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Positions</x.h1>
        <PrimaryButton w="auto" padding="6px 16px" onClick={() => nav('/add-liquidity')}>Add Liquidity</PrimaryButton>
      </x.div>


      <x.div mt={6} border="1px solid" borderColor="white-a80" p={6} borderRadius="16px">
        {data.length === 0 ? (
          <x.p textAlign="center">You do not have open positions</x.p>
        ) : data.map(d => (
          <x.div>
            <x.p>{d.name}</x.p>
            <x.p>{d.formattedBalance}</x.p>
          </x.div>
        ))}
      </x.div>
    </x.div>
  );
}
