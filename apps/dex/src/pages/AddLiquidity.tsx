import { ChangeEvent, useMemo, useState } from 'react';
import { x } from '@xstyled/styled-components';
import { formatUnits, parseUnits } from 'viem';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { SwapSection } from '../components/swap/SwapSection';
import { PrimaryButton } from '../components/PrimaryButton';
import { currencies } from '../utils';
import { usePair } from '../hooks/usePair';
import { useBalance } from '../hooks/useBalance';
import { useAllowance } from '../hooks/useAllowance';
import { useApprove } from '../hooks/useApprove';
import { useAddLiquidity } from '../hooks/useAddLiquidity';
import Big from 'big.js';
import { Currency } from '../types';
import BigNumber from 'bignumber.js';
import { useDexAddresses } from '../hooks/useDexAddresses';


export function AddLiquidity() {
  const dexAddresses = useDexAddresses()

  const [currencyA, setCurrencyA] = useState<Currency>(currencies[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(currencies[1]);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const pair = usePair(currencyA, currencyB);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB.address);

  const allowanceA = useAllowance(currencyA.address, dexAddresses.router);
  const allowanceB = useAllowance(currencyB.address, dexAddresses.router);

  const approveA = useApprove(currencyA.address, dexAddresses.router, parseUnits(firstValue.toString(), currencyA.decimals));
  const approveB = useApprove(currencyB.address, dexAddresses.router, parseUnits(secondValue.toString(), currencyB.decimals));

  const addLiquidity = useAddLiquidity(
    currencyA,
    parseUnits(firstValue.toString(), currencyA.decimals),
    currencyB,
    parseUnits(secondValue.toString(), currencyB.decimals),
  );

  const needAllowanceA = useMemo(() =>
      parseUnits(firstValue.toString(), currencyA.decimals) > 0 &&
      allowanceA.data !== undefined &&
      allowanceA.data < parseUnits(firstValue.toString(), currencyA.decimals),
    [allowanceA, firstValue]);

  const needAllowanceB = useMemo(() =>
      parseUnits(secondValue.toString(), currencyB.decimals) > 0 &&
      allowanceB.data !== undefined &&
      allowanceB.data < parseUnits(firstValue.toString(), currencyB.decimals),
    [allowanceB, secondValue]);

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFirstValue('');
      setSecondValue('');
      return;
    }

    if (e.target.id === 'currencyA') {
      setFirstValue(e.target.value);
      setSecondValue(
        pair.priceCurrencyA.times(new BigNumber(e.target.value)).toString(),
      );
    } else if (e.target.id === 'currencyB') {
      setSecondValue(e.target.value);
      setFirstValue(
        pair.priceCurrencyB.times(new BigNumber(e.target.value)).toString(),
      );
    }
  };
  console.log('new BigNumber(firstValue)', new BigNumber(firstValue).isPositive(), needAllowanceA, allowanceB);
  return (
    <x.div w="100%" maxWidth="480px" padding={4}>
      <x.div display="flex" justifyContent="center" mt={2}>
        <x.p fontSize="3xl">Add Liquidity</x.p>
      </x.div>

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">Deposit</x.p>
                <CurrencySelector disabled={false} selected={false} currency={currencyA} />
              </x.div>

              <NumericalInput id="currencyA" disabled={false} value={firstValue} onChange={onChangeValues} />

              <x.div w="100%" display="flex" mt={2} justifyContent="flex-end">
                <x.p color="gray155">{new Big(formatUnits(balanceA.data ?? 0n, currencyA.decimals)).toFixed(6)}</x.p>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">Deposit</x.p>
                <CurrencySelector disabled={false} selected={false} currency={currencyB} />
              </x.div>

              <NumericalInput id="currencyB" disabled={false} value={secondValue} onChange={onChangeValues} />

              <x.div w="100%" display="flex" mt={2} justifyContent="flex-end">
                <x.p color="gray155">{new Big(formatUnits(balanceB.data ?? 0n, currencyB.decimals)).toFixed(6)}</x.p>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <x.div mb={8}>
        <x.p>Prices</x.p>

        <x.div>
          <x.div>
            <x.p>1 {currencyA.symbol} = {pair.priceCurrencyA.toPrecision(6, 1)} {currencyB.symbol}</x.p>
            <x.p>1 {currencyB.symbol} = {pair.priceCurrencyB.toPrecision(6, 1)} {currencyA.symbol}</x.p>
          </x.div>
          <x.div></x.div>
        </x.div>
      </x.div>

      <x.div display="flex" mb={4}>
        <PrimaryButton
          disabled={!new BigNumber(firstValue).isPositive() || !needAllowanceA}
          onClick={() => approveA.write()}
          mr={4}
        >Approve {currencyA.symbol}</PrimaryButton>
        <PrimaryButton
          disabled={!new BigNumber(secondValue).isPositive() || !needAllowanceB}
          onClick={() => approveB.write()}
          ml={4}
        >Approve {currencyB.symbol}</PrimaryButton>
      </x.div>

      <PrimaryButton disabled={!firstValue || !secondValue} onClick={() => addLiquidity.write()}>Supply</PrimaryButton>
    </x.div>
  );
}
