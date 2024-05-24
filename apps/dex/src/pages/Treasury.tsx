import { x } from '@xstyled/styled-components';
import { useState } from 'react';
import { SwapSection } from '../components/swap/SwapSection';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { PrimaryButton } from '../components/PrimaryButton';
import Modal from 'react-responsive-modal';

//
// const currencies: Currency[] = [{
//   name: 'Treasury Bond Bronze',
//   symbol: 'TBb',
//   icon: '/img/tb-logo.png',
//   address: '0x',
//   chainId: 0,
//   decimals: 18,
// }, {
//   name: 'Treasury Bond Silver',
//   symbol: 'TBs',
//   icon: '/img/tb-logo.png',
//   address: '0x',
//   chainId: 0,
//   decimals: 18,
// }, {
//   name: 'Treasury Bond Gold',
//   symbol: 'TBg',
//   icon: '/img/tb-logo.png',
//   address: '0x',
//   chainId: 0,
//   decimals: 18,
// }, {
//   name: 'LIRA Treasury Bond Bronze',
//   symbol: 'LTBb',
//   icon: '/img/tb-logo.png',
//   address: '0x',
//   chainId: 0,
//   decimals: 8,
// }, {
//   name: 'LIRA Treasury Bond Silver',
//   symbol: 'LTBs',
//   icon: '/img/tb-logo.png',
//   address: '0x',
//   chainId: 0,
//   decimals: 8,
// }, {
//   name: 'LIRA Treasury Bond Gold',
//   symbol: 'LTBg',
//   icon: '/img/tb-logo.png',
//   address: '0x',
//   chainId: 0,
//   decimals: 8,
// }];

const modalCustomStyles = {
  modal: {
    top: '20%',
    backgroundColor: '#1B1B1B',
    borderRadius: 16,
    maxWidth: 420,
    minWidth: 420,
  },
  closeIcon: {
    fill: 'white',
  },
};

export function Treasury() {
  const [open, setOpen] = useState(false);
  const [firstValue, setFirstValue] = useState<number | undefined>(undefined);

  return (
    <x.div w="100%" padding="68px 8px 0px" maxWidth={480} minWidth={480} paddingTop={{ sm: '24px', md: '48px' }}>
      <Modal open={open} onClose={() => setOpen(false)} styles={modalCustomStyles}>
        <x.h1 fontSize="xl">Select Token</x.h1>
        <x.div mt={8}>
          {/*{currencies.map((c, i) => (*/}
          {/*  <x.div key={i} display="flex" alignItems="center" my={4}>*/}
          {/*    <x.div>*/}
          {/*      <x.img src={c.icon} width={48} height={48} />*/}
          {/*    </x.div>*/}
          {/*    <x.div ml={4}>*/}
          {/*      <x.h1>{c.symbol}</x.h1>*/}
          {/*    </x.div>*/}
          {/*  </x.div>*/}
          {/*))}*/}
        </x.div>
      </Modal>
      <SwapSection>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <NumericalInput id="currencyA" disabled={false} value={firstValue} />
              </x.div>

              {/*<CurrencySelector*/}
              {/*  disabled={false}*/}
              {/*  selected={false}*/}
              {/*  currency={currencies[0]}*/}
              {/*  onClick={() => setOpen(true)}*/}
              {/*/>*/}
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

              {/*<CurrencySelector disabled={false} selected={false} currency={currencies[0]} />*/}
            </x.div>

          </Container>
        </InputPanel>
      </SwapSection>
      <PrimaryButton>CONNECT WALLET</PrimaryButton>
    </x.div>
  );
}
