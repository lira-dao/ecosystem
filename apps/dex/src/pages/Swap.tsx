import { useEffect, useMemo, useState } from 'react';
import Big from 'big.js';
import { useTheme, x } from '@xstyled/styled-components';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { SwapSection } from '../components/swap/SwapSection';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { getCurrencies, getPairedCurrencies } from '../utils';
import { useGetAmountsIn, useGetAmountsOut } from '../hooks/useGetAmountsOut';
import { formatUnits, parseUnits } from 'viem';
import { useApprove } from '../hooks/useApprove';
import { useSwap } from '../hooks/useSwap';
import repeatIcon from '../img/fa-repeat.svg';
import { BaseButton } from '../components/BaseButton';
import { PacmanLoader } from 'react-spinners';
import { useAllowance } from '../hooks/useAllowance';
import { useSnackbar } from 'notistack';
import { useBalance } from '../hooks/useBalance';
import { useDexAddresses } from '../hooks/useDexAddresses';
import { useChainId } from 'wagmi';
import { Currency } from '@lira-dao/web3-utils';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';


export function Swap() {
  const th = useTheme();
  const chainId = useChainId();
  const dexAddresses = useDexAddresses();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>([]);

  const [currencyA, setCurrencyA] = useState<Currency>(getCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency | undefined>(undefined);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const allowance1 = useAllowance(currencyA.address, dexAddresses.router);

  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB?.address);

  const [amountOut, setAmountOut] = useState<bigint>(0n);
  const [amountIn, setAmountIn] = useState<bigint>(0n);

  const amountsOut = useGetAmountsOut([currencyA.address, currencyB?.address || '0x0'], amountOut);
  const amountsIn = useGetAmountsIn([currencyA.address, currencyB?.address || '0x0'], amountIn);

  const approve = useApprove(currencyA.address, dexAddresses.router, parseUnits(firstValue.toString(), currencyA.decimals));

  const swap = useSwap([currencyA.address, currencyB?.address || '0x0'], parseUnits(firstValue.toString(), currencyA.decimals));

  const isAllowCurrencyADisabled = useMemo(() => approve.isPending || allowance1.isPending, [approve, allowance1]);

  const needAllowance = useMemo(() =>
      parseUnits(firstValue.toString(), currencyA.decimals) > 0 &&
      allowance1.data !== undefined &&
      allowance1.data < parseUnits(firstValue.toString(), currencyA.decimals),
    [allowance1, firstValue]);

  useEffect(() => {
    if (amountsOut.data) {
      setSecondValue(formatUnits(amountsOut.data[1], currencyB?.decimals || 18));
    }
  }, [amountsOut]);

  useEffect(() => {
    if (amountsIn?.data?.[0]) {
      setFirstValue(formatUnits(amountsIn.data[0], currencyA.decimals));
    }
  }, [amountsIn]);

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
      setAmountIn(0n);
      setAmountOut(0n);
    } else {
      setAmountIn(0n);
      setAmountOut(parseUnits(value, currencyA.decimals));
    }
  };

  const onCurrencyBChange = (value: string) => {
    setSecondValue(value);
    setAmountOut(0n);

    if (value === '') {
      setFirstValue('');
      setAmountOut(0n);
      setAmountIn(0n);
    } else {
      setAmountIn(parseUnits(value, currencyB?.decimals || 18));
      setAmountOut(0n);
    }
  };

  const switchCurrencies = () => {
    if (currencyA && currencyB) {
      const newCurrencyA = currencyB;
      const newCurrencyB = currencyA;

      setAmountOut(0n);
      setAmountIn(0n);

      setCurrencyA(newCurrencyA);
      setCurrencyB(newCurrencyB);

      setFirstValue('');
      setSecondValue('');
    }
  };

  const onCurrencySelectAClick = () => {
    setSelecting(0);
    setSelectingCurrencies(getCurrencies(chainId));
    setOpen(true);
  };

  const onCurrencySelectBClick = () => {
    setSelecting(1);
    setSelectingCurrencies(getPairedCurrencies(chainId, currencyA.paired));
    setOpen(true);
  };

  const onSelectCurrency = (c: any) => {
    if (selecting === 0) {
      setCurrencyA(c);
      setCurrencyB(undefined);
      setFirstValue('');
      setSecondValue('');
      setAmountOut(0n);
      setAmountIn(0n);
    } else {
      setCurrencyB(c);
      setSecondValue('');
      setAmountIn(0n);
    }

    setOpen(false);
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
                <CurrencySelector
                  disabled={false}
                  selected={false}
                  currency={currencyA}
                  onClick={onCurrencySelectAClick}
                />
              </x.div>

              <NumericalInput
                id="currencyA"
                disabled={amountsIn.isLoading || !currencyB}
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
                <CurrencySelector
                  disabled={false}
                  selected={false}
                  currency={currencyB}
                  onClick={onCurrencySelectBClick}
                />
              </x.div>

              <NumericalInput
                id="currencyB"
                disabled={amountsOut.isLoading || !currencyB}
                value={secondValue}
                onChange={(e) => onCurrencyBChange(e.target.value)}
              />

              <x.div w="100%" display="flex" justifyContent="flex-end" mt={2}>
                <x.p color="gray155">{new Big(formatUnits(balanceB.data ?? 0n, currencyB?.decimals || 18)).toFixed(6)}</x.p>
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

      <SelectCurrencyModal
        open={open}
        onClose={() => setOpen(false)}
        currencies={selectingCurrencies}
        onSelect={onSelectCurrency}
      />
    </x.div>
  );
}
