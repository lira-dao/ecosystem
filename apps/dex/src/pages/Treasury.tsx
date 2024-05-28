import { useTheme, x } from '@xstyled/styled-components';
import { useTreasury } from '../hooks/useTreasury';
import metamaskFox from '../img/metamask-fox.svg';
import { addTreasuryToken } from '../utils';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';


export function Treasury() {
  const th = useTheme();
  const navigate = useNavigate();
  const treasuries = useTreasury();

  console.log('treasury', treasuries);

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="680px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Treasury Tokens</x.h1>
      </x.div>

      <x.div mt={6} p={6} borderRadius="16px">
        {treasuries.map((treasury, i) => (
          <x.div
            key={i}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={i < treasuries.length - 1 ? 4 : 0}
            pb={4}
            borderBottom="1px solid"
            borderColor={th?.colors.gray155}
          >
            <x.div display="flex" flexGrow={1} justifyContent="space-between" mr={4}>
              <x.div>
                <x.div display="flex" alignItems="center">
                  <x.p fontSize="2xl" mr={2}>{treasury.name} ({treasury.symbol})</x.p>
                  <x.img
                    src={metamaskFox}
                    alt="metamask icon"
                    width={30}
                    cursor="pointer"
                    mr={2}
                    onClick={() => addTreasuryToken(treasury)}
                  />
                </x.div>
                <x.p fontSize="xl">BALANCE: {treasury.formattedBalance}</x.p>
              </x.div>
            </x.div>

            <x.div display="flex" justifyContent="space-between">
              <PrimaryButton
                w="fit-content"
                h="fit-content"
                mr={2}
                backgroundColor={th?.colors['green-yellow-700']}
                onClick={() => navigate(`/treasury/${treasury.address}/mint`)}
              >MINT</PrimaryButton>
              <PrimaryButton
                w="fit-content"
                h="fit-content"
                backgroundColor={th?.colors['red-700']}
                onClick={() => navigate(`/treasury/${treasury.address}/burn`)}
              >BURN</PrimaryButton>
            </x.div>
          </x.div>
        ))}
      </x.div>
    </x.div>
  );
}
