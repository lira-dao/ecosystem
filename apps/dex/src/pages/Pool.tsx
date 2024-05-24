import { useTheme, x } from '@xstyled/styled-components';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { useGetBalances } from '../hooks/useGetBalances';
import { useReserves } from '../hooks/useReserves';
import BigNumber from 'bignumber.js';
import { formatUnits } from 'viem';
import { useDexPairs } from '../hooks/useDexPairs';
import { addLdtWeth, getCurrencies, getCurrencyByAddress } from '../utils';
import { useChainId } from 'wagmi';
import metamaskFox from '../img/metamask-fox.svg';
import dexToolsLogo from '../img/dex-tools-logo.png';


export function Pool() {
  const th = useTheme();
  const chainId = useChainId();
  const currencies = getCurrencies(chainId)
  const navigate = useNavigate();
  const { data } = useGetBalances();
  const reserves = useReserves();
  const dexPairs = useDexPairs();

  console.log('dexPairs', dexPairs)

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
                <x.div display="flex" alignItems="center">
                  <x.p fontSize="2xl" mr={2}>{d.name}</x.p>
                  <x.img
                    src={metamaskFox}
                    alt="metamask icon"
                    width={30}
                    cursor="pointer"
                    mr={2}
                    onClick={() => addLdtWeth()}
                  />
                  <a href="https://www.dextools.io/app/en/arbitrum/pair-explorer/0xc828f6c8bbf9a90db6db9839696ffbf6e06532f9?t=1716541699451" target="_blank" rel="noopener noreferrer">
                    <img
                      src={dexToolsLogo}
                      alt="metamask icon"
                      width={24}
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                </x.div>
                <x.p fontSize="xl">LP: {d.formattedBalance}</x.p>
              </x.div>

              <x.div textAlign="right">
                <x.p fontSize="xl">{new BigNumber(formatUnits(reserves?.data?.[i].result?.[0] ?? 0n, getCurrencyByAddress(dexPairs[d.address].tokens[0])?.decimals ?? 0)).toFormat(2, 1)} {getCurrencyByAddress(dexPairs[d.address].tokens[0])?.symbol}</x.p>
                <x.p fontSize="xl">{new BigNumber(formatUnits(reserves?.data?.[i].result?.[1] ?? 0n, getCurrencyByAddress(dexPairs[d.address].tokens[1])?.decimals ?? 0)).toFormat(2, 1)} {getCurrencyByAddress(dexPairs[d.address].tokens[1])?.symbol}</x.p>
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
