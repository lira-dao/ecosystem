import { useEffect, useMemo, useState } from 'react';
import { useTheme, x } from '@xstyled/styled-components';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { SwapSection } from '../components/swap/SwapSection';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { currencies } from '../utils';
import { useGetAmountsIn, useGetAmountsOut } from '../hooks/useGetAmountsOut';
import { formatUnits, parseUnits } from 'viem';
import { useApprove } from '../hooks/useApprove';
import { addresses } from '@lira-dao/web3-utils';
import { useSwap } from '../hooks/useSwap';
import { Currency } from '../types';
import repeatIcon from '../img/fa-repeat.svg';
import { BaseButton } from '../components/BaseButton';
import { PacmanLoader } from 'react-spinners';
import { useAllowance } from '../hooks/useAllowance';
import { useSnackbar } from 'notistack';
import { useBalance } from '../hooks/useBalance';
import { useAccount } from 'wagmi';
import Big from 'big.js';


export function useCurrency(c: Currency) {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [value, setValue] = useState<Big.Big>(new Big('0'));
  const [currency, setCurrency] = useState<Currency>(c);


  return {
    currency,
    isDisabled,
    setCurrency,
    setIsDisabled,
  };
}


export function Swap() {
  const th = useTheme();
  const account = useAccount();
  const { enqueueSnackbar } = useSnackbar();

  const {
    currency: currencyA,
    setCurrency: setCurrencyA,
    isDisabled: isDisabledA,
    setIsDisabled: setIsDisabledA,
  } = useCurrency(currencies[0]);

  const {
    currency: currencyB,
    setCurrency: setCurrencyB,
    isDisabled: isDisabledB,
    setIsDisabled: setIsDisabledB,
  } = useCurrency(currencies[1]);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const allowance1 = useAllowance(currencyA.address, addresses.arbitrumSepolia.router);

  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true);

  const balanceA = useBalance(addresses.arbitrumSepolia.ldt, account.address);
  const balanceB = useBalance(addresses.arbitrumSepolia.weth, account.address);

  const [amountOut, setAmountOut] = useState<bigint>(0n);
  const [amountIn, setAmountIn] = useState<bigint>(0n);

  const amountsOut = useGetAmountsOut([currencyA.address, currencyB.address], amountOut);
  const amountsIn = useGetAmountsIn([currencyA.address, currencyB.address], amountIn);

  const approve = useApprove(currencyA.address, addresses.arbitrumSepolia.router, parseUnits(firstValue.toString(), currencyA.decimals));

  const swap = useSwap([currencyA.address, currencyB.address], parseUnits(firstValue.toString(), currencyA.decimals));

  const isAllowCurrencyADisabled = useMemo(() => approve.isPending || allowance1.isPending, [approve, allowance1]);

  const needAllowance = useMemo(() =>
      parseUnits(firstValue.toString(), currencyA.decimals) > 0 &&
      allowance1.data !== undefined &&
      allowance1.data < parseUnits(firstValue.toString(), currencyA.decimals),
    [allowance1, firstValue]);

  useEffect(() => {
    if (amountsOut.data) {
      setSecondValue(formatUnits(amountsOut.data[1], currencyB.decimals));
    }
  }, [amountsOut.data]);

  useEffect(() => {
    if (amountsIn.data) {
      setFirstValue(formatUnits(amountsIn.data[0], currencyA.decimals));
    }
  }, [amountsIn.data]);

  useEffect(() => {
    if (swap.isPending) {
      setIsSwapDisabled(true);
    } else {
      setIsSwapDisabled(false);
    }
  }, [swap.isPending]);

  useEffect(() => {
    if (approve.confirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      allowance1.refetch();
    }
  }, [approve.confirmed]);

  useEffect(() => {
    if (swap.confirmed) {
      enqueueSnackbar('Swap confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      swap.reset();
      balanceA.refetch();
      balanceB.refetch();
      setFirstValue('');
      setSecondValue('');
    }
  }, [swap.confirmed]);

  const onCurrencyAChange = (value: string) => {
    setFirstValue(value);

    if (value === '') {
      setSecondValue('');
    }

    setAmountOut(parseUnits(value, currencyA.decimals));
  };

  const onCurrencyBChange = (value: string) => {
    setSecondValue(value);
    setFirstValue('');
    setAmountIn(parseUnits(value, currencyB.decimals));
  };

  const switchCurrencies = () => {
    const newCurrencyA = currencyB;
    const newCurrencyB = currencyA;

    setAmountOut(0n);
    setAmountIn(0n);

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
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">You Pay</x.p>
                <CurrencySelector disabled={false} selected={false} currency={currencyA} />
              </x.div>

              <NumericalInput
                id="currencyA"
                disabled={amountsIn.isLoading}
                value={firstValue}
                onChange={(e) => onCurrencyAChange(e.target.value)}
              />

              <x.div w="100%" display="flex" mt={2} justifyContent="flex-end">
                <x.p color="gray155">{new Big(formatUnits(balanceA.data ?? 0n, currencyA.decimals)).toFixed(6)}</x.p>
              </x.div>
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
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">You Receive</x.p>
                <CurrencySelector disabled={false} selected={false} currency={currencyB} />
              </x.div>

              <NumericalInput
                id="currencyB"
                disabled={amountsOut.isLoading}
                value={secondValue}
                onChange={(e) => onCurrencyBChange(e.target.value)}
              />

              <x.div w="100%" display="flex" justifyContent="flex-end" mt={2}>
                <x.p color="gray155">{new Big(formatUnits(balanceB.data ?? 0n, currencyB.decimals)).toFixed(6)}</x.p>
              </x.div>
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
            <PrimaryButton disabled={!firstValue && !secondValue} onClick={() => swap.write()}>Swap</PrimaryButton>
          )}
        </x.div>
      )}
    </x.div>
  );
}
