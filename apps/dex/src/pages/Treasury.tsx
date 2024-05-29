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

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="680px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Treasury Tokens</x.h1>
      </x.div>

      <x.div mt={6} borderRadius="16px">
        {treasuries.map((treasury, i) => (
          <x.div
            key={i}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
            mb={i < treasuries.length - 1 ? 8 : 0}
            pb={8}
            borderBottom="1px solid"
            borderColor={th?.colors.gray155}
          >
            <x.div w="100%" display="flex">
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


            <x.div w="100%" display="flex" flexDirection={{_: 'column', md: 'row'}} alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" justifyContent="space-between" mr={{_: 0, md: 8}} my={{_: 8, md: 0}}>
                <x.div>
                  <x.p fontSize="xl" mb={2}>Balance: {treasury.formattedBalance} {treasury.symbol}</x.p>
                  <x.p fontSize="xl">Rate: {treasury.rate?.toString()} {treasury.paired[0]}</x.p>
                </x.div>

                <x.div>
                  <x.p fontSize="xl" mb={2}>Mint Fee: {treasury.mintFee?.toString()}%</x.p>
                  <x.p fontSize="xl">Burn Fee: {treasury.burnFee?.toString()}%</x.p>
                </x.div>
              </x.div>

              <x.div w={{_: '100%', md: 'fit-content'}} display="flex" flexDirection="column" justifyContent="space-between">
                <PrimaryButton
                  w={{ _: '100%', md: '180px' }}
                  h="fit-content"
                  mt={{ _: 4, md: 0 }}
                  mb={2}
                  backgroundColor={th?.colors['green-yellow-700']}
                  onClick={() => navigate(`/treasury/${treasury.address}/mint`)}
                >MINT</PrimaryButton>
                <PrimaryButton
                  w={{ _: '100%', md: '180px' }}
                  h="fit-content"
                  backgroundColor={{_: th?.colors['red-700'], hover: th?.colors['red-600']}}
                  onClick={() => navigate(`/treasury/${treasury.address}/burn`)}
                >BURN</PrimaryButton>
              </x.div>
            </x.div>
          </x.div>
        ))}
      </x.div>
    </x.div>
  );
}
