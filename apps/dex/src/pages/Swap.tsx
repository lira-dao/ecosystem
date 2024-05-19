import { useEffect, useState } from 'react';
import { useTheme, x } from '@xstyled/styled-components';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { SwapSection } from '../components/swap/SwapSection';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { currencies } from '../utils';
import { useGetAmountsOut } from '../hooks/useGetAmountsOut';
import { formatUnits, parseUnits } from 'viem';
import { useApprove } from '../hooks/useApprove';
import { addresses } from '@lira-dao/web3-utils';
import { useSwap } from '../hooks/useSwap';
import { Currency } from '../types';
import repeatIcon from '../img/fa-repeat.svg';
import { BaseButton } from '../components/BaseButton';
import { PacmanLoader } from 'react-spinners';


export function Swap() {
  const th = useTheme()
  const [currencyA, setCurrencyA] = useState<Currency>(currencies[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(currencies[1]);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const [isAllowCurrencyADisabled, setIsAllowCurrencyADisabled] = useState<boolean>(false);

  const amountsOut = useGetAmountsOut([currencyA.address, currencyB.address], parseUnits(firstValue.toString(), 18));

  const approve = useApprove(currencyA.address, addresses.arbitrumSepolia.router, parseUnits(firstValue.toString(), 18));

  const swap = useSwap([currencyA.address, currencyB.address], parseUnits(firstValue.toString(), 18));

  useEffect(() => {
    if (amountsOut.data) {
      setSecondValue(formatUnits(amountsOut.data[1], 18));
    }
  }, [amountsOut.data]);

  const switchCurrencies = () => {
    const newCurrencyA = currencyB;
    const newCurrencyB = currencyA;

    setCurrencyA(newCurrencyA);
    setCurrencyB(newCurrencyB);

    setFirstValue('');
    setSecondValue('');
  };

  return (
    <x.div w="100%" maxWidth="480px" borderRadius="16px" padding={4}>
      <x.div display="flex" justifyContent="center" mt={2}>
        <x.p>Swap</x.p>
      </x.div>

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <NumericalInput
                  id="currencyA"
                  disabled={false}
                  value={firstValue}
                  onChange={(e) => setFirstValue(e.target.value)}
                />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencyA} />
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <x.div>
        <BaseButton
          backgroundColor={{_: 'green-yellow-950', hover: 'green-yellow-900'}}
          border="6px solid black"
          p={2}
          position="relative"
          w="fit-content"
          margin="-36px auto"
          zIndex={1}
          onClick={switchCurrencies}
        >
          <img src={repeatIcon} alt="switch currencies icon" width={20} />
        </BaseButton>
      </x.div>

      <SwapSection mt={4} mb={8}>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <x.p color="gray155" userSelect="none">You Receive</x.p>
                <NumericalInput
                  id="currencyB"
                  disabled={false}
                  value={secondValue}
                  onChange={(e) => setSecondValue(e.target.value)}
                />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencyB} />
            </x.div>

          </Container>
        </InputPanel>
      </SwapSection>
      <x.div display="flex" mb={4}>
        <PrimaryButton
          disabled={isAllowCurrencyADisabled}
          onClick={() => approve.write()}
        >Approve {currencyA.symbol}</PrimaryButton>
      </x.div>

      <PrimaryButton onClick={() => swap.write()}>Swap</PrimaryButton>
      <PrimaryButton onClick={() => swap.write()}><PacmanLoader color={th?.colors['aqua-900']} /></PrimaryButton>
    </x.div>
  );
}
