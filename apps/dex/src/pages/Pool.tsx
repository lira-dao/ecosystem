import { useTheme, x } from '@xstyled/styled-components';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useGetBalances } from '../hooks/useGetBalances';
import { useReserves } from '../hooks/useReserves';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'viem';
import { getPoolCurrencies } from '../utils';


export function Pool() {
  const th = useTheme();
  const navigate = useNavigate();
  const { data } = useGetBalances();
  const reserves = useReserves();


  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="680px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Positions</x.h1>
        <PrimaryButton w="fit-content" padding="6px 16px" onClick={() => navigate('/add-liquidity')}>Add
          Liquidity</PrimaryButton>
      </x.div>

      <x.div mt={6} p={6} borderRadius="16px">
        {data.length === 0 ? (
          <x.p textAlign="center">You do not have open positions</x.p>
        ) : data.map((d, i) => (
          <x.div
            key={i}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={i < data.length - 1 ? 4 : 0}
            pb={4}
            borderBottom="1px solid"
            borderColor={th?.colors.gray155}
          >
            <x.div display="flex" flexGrow={1} justifyContent="space-between" mr={4}>
              <x.div>
                <x.p fontSize="2xl">{d.name}</x.p>
                <x.p fontSize="xl">LP: {d.formattedBalance}</x.p>
              </x.div>

              <x.div textAlign="right">
                <x.p fontSize="xl">{new BigNumber(formatUnits(reserves?.data?.[i].result?.[0] ?? 0n, getPoolCurrencies(d.address)[0].decimals)).toFormat(2, 1)} {getPoolCurrencies(d.address)[0].symbol}</x.p>
                <x.p fontSize="xl">{new BigNumber(formatUnits(reserves?.data?.[i].result?.[1] ?? 0n, getPoolCurrencies(d.address)[1].decimals)).toFormat(2, 1)} {getPoolCurrencies(d.address)[1].symbol}</x.p>
              </x.div>
            </x.div>

            <x.div display="flex" justifyContent="space-between">
              <PrimaryButton
                w="fit-content"
                h="fit-content"
                backgroundColor={th?.colors['green-yellow-700']}
                onClick={() => navigate(`/remove-liquidity/${d.address}`)}
              >Remove</PrimaryButton>
            </x.div>
          </x.div>
        ))}
      </x.div>
    </x.div>
  );
}
