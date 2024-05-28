import { useTheme, x } from '@xstyled/styled-components';
import { PrimaryButton } from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import { usePools } from '../hooks/usePools';
import { addPoolToMetamask } from '../utils';
import metamaskFox from '../img/metamask-fox.svg';
import dexScreenerLogo from '../img/dex-screener.svg';


export function Pool() {
  const th = useTheme();
  const navigate = useNavigate();
  const pools = usePools();

  return (
    <x.div display="flex" w="100%" flexDirection="column" maxWidth="680px" p={4}>
      <x.div display="flex" alignItems="center" justifyContent="space-between">
        <x.h1 fontSize="4xl">Positions</x.h1>
        <PrimaryButton w="fit-content" padding="6px 16px" onClick={() => navigate('/add-liquidity')}>Add
          Liquidity</PrimaryButton>
      </x.div>

      <x.div mt={6} p={6} borderRadius="16px">
        {pools.length === 0 ? (
          <x.p textAlign="center">You do not have open positions</x.p>
        ) : pools.map((pool, i) => (
          <x.div
            key={i}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={i < pools.length - 1 ? 4 : 0}
            pb={4}
            borderBottom="1px solid"
            borderColor={th?.colors.gray155}
          >
            <x.div display="flex" flexGrow={1} justifyContent="space-between" mr={4}>
              <x.div>
                <x.div display="flex" alignItems="center">
                  <x.p fontSize="2xl" mr={2}>{pool.name}</x.p>
                  <x.img
                    src={metamaskFox}
                    alt="metamask icon"
                    width={30}
                    cursor="pointer"
                    mr={2}
                    onClick={() => addPoolToMetamask(pool.address)}
                  />
                  <a
                    href={`https://dexscreener.com/arbitrum/${pool.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={dexScreenerLogo}
                      alt="metamask icon"
                      width={20}
                      style={{ cursor: 'pointer' }}
                    />
                  </a>
                </x.div>
                <x.p fontSize="xl">LP: {pool.formattedBalance}</x.p>
              </x.div>

              <x.div textAlign="right">
                <x.p fontSize="xl">{pool.reserve0} {pool.token0?.symbol}</x.p>
                <x.p fontSize="xl">{pool.reserve1} {pool.token1?.symbol}</x.p>
              </x.div>
            </x.div>

            <x.div display="flex" justifyContent="space-between">
              <PrimaryButton
                w="fit-content"
                h="fit-content"
                backgroundColor={{_: th?.colors['red-700'], hover: th?.colors['red-600']}}
                onClick={() => navigate(`/remove-liquidity/${pool.address}`)}
              >Remove</PrimaryButton>
            </x.div>
          </x.div>
        ))}
      </x.div>
    </x.div>
  );
}
