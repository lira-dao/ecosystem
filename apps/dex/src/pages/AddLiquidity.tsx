import { x } from '@xstyled/styled-components';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { SwapSection } from '../components/swap/SwapSection';
import { ChangeEvent, useState } from 'react';
import { PrimaryButton } from '../components/PrimaryButton';
import { currencies } from '../utils';
import { usePair } from '../hooks/pair';


export function AddLiquidity() {
  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const pair = usePair(currencies[0], currencies[1]);

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('id', e.target.id);

    if (e.target.id === 'currencyA') {
      setFirstValue(e.currentTarget.value);
      setSecondValue((parseFloat(e.target.value) * parseFloat(pair.reserveB.toString())) / parseFloat(pair.reserveA.toString()))
    } else if (e.target.id === 'currencyB') {
      setSecondValue(e.currentTarget.value);
      setFirstValue((parseFloat(e.target.value) * parseFloat(pair.reserveA.toString())) / parseFloat(pair.reserveB.toString()))
    }
  }

  return (
    <x.div w="100%" maxWidth="480px">
      <x.div display="flex" justifyContent="space-between">
        <x.p>back</x.p>
        <x.p>Add Liquidity</x.p>
        <x.p>config</x.p>
      </x.div>

      <SwapSection>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <NumericalInput id="currencyA" disabled={false} value={firstValue} onChange={onChangeValues} />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencies[0]} />
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <SwapSection>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <NumericalInput id="currencyB" disabled={false} value={secondValue} onChange={onChangeValues} />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencies[1]} />
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <x.div>
        <x.p>Prices</x.p>

        <x.div>
          <x.div>
            <x.p>1 {currencies[0].symbol} = {pair.priceCurrencyA} {currencies[1].symbol}</x.p>
            <x.p>1 {currencies[1].symbol} = {pair.priceCurrencyB} {currencies[0].symbol}</x.p>
          </x.div>
          <x.div></x.div>
        </x.div>
      </x.div>

      <PrimaryButton>CONNECT WALLET</PrimaryButton>
    </x.div>
  );
}
