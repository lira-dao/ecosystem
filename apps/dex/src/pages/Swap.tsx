import { useEffect, useMemo, useState } from 'react';
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
import { useAllowance } from '../hooks/useAllowance';


export function Swap() {
  const th = useTheme();
  const [currencyA, setCurrencyA] = useState<Currency>(currencies[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(currencies[1]);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const allowance1 = useAllowance(currencyA.address, addresses.arbitrumSepolia.router);

  const [isAllowCurrencyADisabled, setIsAllowCurrencyADisabled] = useState<boolean>(false);
  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true);

  const amountsOut = useGetAmountsOut([currencyA.address, currencyB.address], parseUnits(firstValue.toString(), 18));

  const approve = useApprove(currencyA.address, addresses.arbitrumSepolia.router, parseUnits(firstValue.toString(), 18));

  const swap = useSwap([currencyA.address, currencyB.address], parseUnits(firstValue.toString(), 18));

  const needAllowance = useMemo(() =>
      BigInt(firstValue) > 0 &&
      allowance1.data !== undefined &&
      allowance1.data < BigInt(firstValue) * 10n ** 18n,
    [allowance1, firstValue]);

  // console.log('needAllowance', needAllowance);

  useEffect(() => {
    if (amountsOut.data) {
      setSecondValue(formatUnits(amountsOut.data[1], 18));
    }
  }, [amountsOut.data]);

  useEffect(() => {
    if (approve.isLoading || allowance1.isLoading) {
      setIsAllowCurrencyADisabled(true);
    } else {
      setIsAllowCurrencyADisabled(false);
    }
  }, [approve.isLoading]);

  useEffect(() => {
    if (swap.isLoading) {
      setIsSwapDisabled(true);
    } else {
      setIsSwapDisabled(false);
    }
  }, [swap.isLoading]);

  useEffect(() => {
    if (approve.confirmed) {
      allowance1.refetch();
    }
  }, [approve.confirmed]);

  useEffect(() => {
    if (swap.confirmed) {
      console.log('swap reset');
      swap.reset();
      setFirstValue('');
      setSecondValue('');
    }
  }, [swap.confirmed]);

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
        <x.p fontSize="3xl">Swap</x.p>
      </x.div>

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <CurrencySelector disabled={false} selected={false} currency={currencyA} />
              </x.div>

              <NumericalInput
                id="currencyA"
                disabled={false}
                value={firstValue}
                onChange={(e) => setFirstValue(e.target.value)}
              />
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <x.div>
        <BaseButton
          backgroundColor={{ _: 'green-yellow-950', hover: 'green-yellow-900' }}
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

      <SwapSection mt={4}>
        <InputPanel>
          <Container>
            <x.div display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">You Receive</x.p>
                <CurrencySelector disabled={false} selected={false} currency={currencyB} />
              </x.div>

              <NumericalInput
                id="currencyB"
                disabled={false}
                value={secondValue}
                onChange={(e) => setSecondValue(e.target.value)}
              />
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      {needAllowance && (
        <x.div display="flex" mt={4} mb={2} h="80px" alignItems="center" justifyContent="center">
          {isAllowCurrencyADisabled ? (
            <PacmanLoader color={th?.colors.gray155} />
          ) : (
            <PrimaryButton
              disabled={isAllowCurrencyADisabled}
              onClick={() => approve.write()}
            >Approve {currencyA.symbol}</PrimaryButton>
          )}
        </x.div>
      )}

      {!needAllowance && (
        <x.div display="flex" mt={needAllowance ? 2 : 4} h="80px" alignItems="center" justifyContent="center">
          {isSwapDisabled ? (
            <PacmanLoader color={th?.colors.gray155} />
          ) : (
            <PrimaryButton disabled={!firstValue} onClick={() => swap.write()}>Swap</PrimaryButton>
          )}
        </x.div>
      )}

      {/*<PrimaryButton onClick={() => swap.write()}><PacmanLoader color={th?.colors['aqua-900']} /></PrimaryButton>*/}
    </x.div>
  );
}
