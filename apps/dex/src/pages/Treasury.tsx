import { x } from '@xstyled/styled-components';
import { useState } from 'react';
import { StyledTabItem } from '../components/StyledTabItem';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { CurrencySelector } from '../components/CurrencySelector';
import { NumericalInput } from '../components/StyledInput';
import Big from 'big.js';
import { formatUnits, parseUnits } from 'viem';
import { SwapSection } from '../components/swap/SwapSection';
import { Currency } from '@lira-dao/web3-utils';
import { getCurrencies, getTreasuryCurrencies } from '../utils';
import { useChainId } from 'wagmi';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';
import { useBalance } from '../hooks/useBalance';


enum TreasuryHeaderTab {
  Mint,
  Burn
}

export function Treasury() {
  const [active, setActive] = useState<TreasuryHeaderTab>(TreasuryHeaderTab.Mint);
  const [open, setOpen] = useState(false);

  const chainId = useChainId();

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const [currencyA, setCurrencyA] = useState<Currency>(getTreasuryCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(getCurrencies(chainId)[0]);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB?.address);

  console.log('balanceA', balanceA);

  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>([]);

  const onCurrencyChange = (value: string) => {
    setFirstValue(value);

    if (value === '') {
      setSecondValue('');
    }
  };

  const onCurrencySelectClick = () => {
    setSelectingCurrencies(getTreasuryCurrencies(chainId));
    setOpen(true);
  };

  const onSelectCurrency = (c: Currency) => {
    setCurrencyA(c);

    if (c.paired.includes('LDT')) {
      setCurrencyB(getCurrencies(chainId)[0])
    } else if (c.paired.includes('LIRA')) {
      setCurrencyB(getCurrencies(chainId)[1])
    }

    setFirstValue('');
    setOpen(false);
  };

  return (
    <x.div w="100%" maxWidth="480px" borderRadius="16px" padding={4}>
      <x.div display="flex" justifyContent="center" mt={2}>
        <x.p fontSize="3xl">Treasury</x.p>
      </x.div>

      <x.div display="flex" pt={8}>
        <StyledTabItem
          $active={active === TreasuryHeaderTab.Mint}
          onClick={() => setActive(TreasuryHeaderTab.Mint)}
        >MINT</StyledTabItem>
        <StyledTabItem
          $active={active === TreasuryHeaderTab.Burn}
          onClick={() => setActive(TreasuryHeaderTab.Burn)}
        >BURN</StyledTabItem>
      </x.div>



      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <CurrencySelector
                  disabled={false}
                  selected={false}
                  currency={currencyA}
                  onClick={onCurrencySelectClick}
                />
              </x.div>

              <NumericalInput
                id="currencyA"
                disabled={false}
                value={firstValue}
                onChange={(e) => onCurrencyChange(e.target.value)}
              />

              <x.div w="100%" display="flex" mt={2} justifyContent="flex-end">
                <x.p color="gray155">{new Big(formatUnits(balanceA.data ?? 0n, currencyA.decimals)).toFixed(6)}</x.p>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <SwapSection mt={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">You Receive</x.p>
                <CurrencySelector
                  disabled={true}
                  selected={false}
                  currency={currencyB}
                  onClick={() => {}}
                />
              </x.div>

              <NumericalInput
                id="currencyB"
                disabled={true}
                value={secondValue}
                onChange={() => {}}
              />

              <x.div w="100%" display="flex" justifyContent="flex-end" mt={2}>
                <x.p color="gray155">{new Big(formatUnits(balanceB.data ?? 0n, currencyB.decimals)).toFixed(6)}</x.p>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <SelectCurrencyModal
        open={open}
        onClose={() => setOpen(false)}
        currencies={selectingCurrencies}
        onSelect={onSelectCurrency}
      />
    </x.div>
  );
}
