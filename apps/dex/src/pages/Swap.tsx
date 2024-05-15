import { useState } from 'react';
import { x } from '@xstyled/styled-components';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { SwapSection } from '../components/swap/SwapSection';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { currencies } from '../utils';


export function Swap() {
  const [firstValue, setFirstValue] = useState<number | undefined>(undefined);

  return (
    <x.div w="100%" padding="68px 8px 0px" maxWidth={480} minWidth={480} paddingTop={{ sm: '24px', md: '48px' }}>
      <SwapSection>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <NumericalInput id="currencyA" disabled={false} value={firstValue} />
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
                <x.p color="gray155" userSelect="none">You Receive</x.p>
                <NumericalInput id="currencyB" disabled={false} value={firstValue} />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencies[0]} />
            </x.div>

          </Container>
        </InputPanel>
      </SwapSection>
      <PrimaryButton>CONNECT WALLET</PrimaryButton>
    </x.div>
  );
}
