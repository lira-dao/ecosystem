import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { x } from '@xstyled/styled-components';
import { formatUnits, parseUnits } from 'viem';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { NumericalInput } from '../components/StyledInput';
import { CurrencySelector } from '../components/CurrencySelector';
import { SwapSection } from '../components/swap/SwapSection';
import { PrimaryButton } from '../components/PrimaryButton';
import { getCurrencies, getPairedCurrencies } from '../utils';
import { usePair } from '../hooks/usePair';
import { useBalance } from '../hooks/useBalance';
import { useAllowance } from '../hooks/useAllowance';
import { useApprove } from '../hooks/useApprove';
import { useAddLiquidity } from '../hooks/useAddLiquidity';
import Big from 'big.js';
import BigNumber from 'bignumber.js';
import { useDexAddresses } from '../hooks/useDexAddresses';
import { useBalance as useBalanceWagmi, useChainId } from 'wagmi';
import { Currency, EthereumAddress } from '@lira-dao/web3-utils';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';
import { useSnackbar } from 'notistack';
import { useDebounce } from 'use-debounce';


export function AddLiquidity() {
  const { enqueueSnackbar } = useSnackbar();
  const chainId = useChainId();
  const dexAddresses = useDexAddresses();
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>([]);
  const [isDisabledAllowanceA, setIsDisabledAllowanceA] = useDebounce<boolean>(false, 500, { leading: true });
  const [isDisabledAllowanceB, setIsDisabledAllowanceB] = useDebounce<boolean>(false, 500, { leading: true });
  const [isDisabledSupply, setIsDisabledSupply] = useDebounce<boolean>(false, 500, { leading: true });

  const [currencyA, setCurrencyA] = useState<Currency>(getCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency | undefined>(undefined);

  const [firstValue, setFirstValue] = useState<string>('');
  const [secondValue, setSecondValue] = useState<string>('');

  const pair = usePair(currencyA, currencyB);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB?.address);

  const accountBalance = useBalanceWagmi();

  const allowanceA = useAllowance(currencyA.address, dexAddresses.router);
  const allowanceB = useAllowance(currencyB?.address as EthereumAddress, dexAddresses.router);

  const approveA = useApprove(currencyA.address, dexAddresses.router, parseUnits(firstValue.toString(), currencyA.decimals));
  const approveB = useApprove(currencyB?.address as EthereumAddress, dexAddresses.router, parseUnits(secondValue.toString(), currencyB?.decimals || 0));

  const addLiquidity = useAddLiquidity(
    currencyA,
    parseUnits(firstValue.toString(), currencyA.decimals),
    currencyB,
    parseUnits(secondValue.toString(), currencyB?.decimals || 0),
  );

  const needAllowanceA = useMemo(() =>
      parseUnits(firstValue.toString(), currencyA.decimals) > 0 &&
      allowanceA.data !== undefined &&
      allowanceA.data < parseUnits(firstValue.toString(), currencyA.decimals),
    [allowanceA, firstValue]);

  const needAllowanceB = useMemo(() =>
      currencyB?.decimals &&
      parseUnits(secondValue.toString(), currencyB.decimals) > 0 &&
      allowanceB.data !== undefined &&
      allowanceB.data < parseUnits(secondValue.toString(), currencyB.decimals),
    [allowanceB, secondValue]);

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFirstValue('');
      setSecondValue('');
      return;
    }

    if (e.target.id === 'currencyA') {
      setFirstValue(e.target.value);

      if (pair.priceCurrencyB.gt(0)) {
        setSecondValue(
          pair.priceCurrencyA.times(new BigNumber(e.target.value)).toString(),
        );
      }

    } else if (e.target.id === 'currencyB') {
      setSecondValue(e.target.value);
      if (pair.priceCurrencyB.gt(0)) {
        setFirstValue(
          pair.priceCurrencyB.times(new BigNumber(e.target.value)).toString(),
        );
      }
    }
  };

  // disabled
  useEffect(() => {
    if (!new BigNumber(firstValue).isPositive() || !needAllowanceA || approveA.isPending || allowanceA.isPending) {
      setIsDisabledAllowanceA(true);
    } else {
      setIsDisabledAllowanceA(false);
    }
  }, [allowanceA.isPending, approveA.isPending, firstValue, needAllowanceA]);

  useEffect(() => {
    if (!new BigNumber(secondValue).isPositive() || !needAllowanceB || approveB.isPending || allowanceB.isPending) {
      setIsDisabledAllowanceB(true);
    } else {
      setIsDisabledAllowanceB(false);
    }
  }, [allowanceB.isPending, approveB.isPending, secondValue, needAllowanceB]);

  useEffect(() => {
    if (!firstValue || !secondValue || needAllowanceA || needAllowanceB || addLiquidity.isPending) {
      setIsDisabledSupply(true);
    } else {
      setIsDisabledSupply(false);
    }
  }, [addLiquidity.isPending, firstValue, needAllowanceA, needAllowanceB, secondValue]);

  // confirmations
  useEffect(() => {
    if (approveA.confirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });

      allowanceA.refetch();
    }
  }, [approveA.confirmed]);

  useEffect(() => {
    if (approveB.confirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });

      allowanceB.refetch();
    }
  }, [approveB.confirmed]);

  useEffect(() => {
    if (addLiquidity.confirmed) {
      enqueueSnackbar('Add Liquidity confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });

      setFirstValue('');
      setSecondValue('');
    }
  }, [addLiquidity.confirmed]);

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
    } else {
      setCurrencyB(c);
      setSecondValue('');
    }

    setOpen(false);
  };

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
                <CurrencySelector
                  disabled={false}
                  selected={false}
                  currency={currencyA}
                  onClick={onCurrencySelectAClick}
                />
              </x.div>

              <NumericalInput id="currencyA" disabled={!currencyB} value={firstValue} onChange={onChangeValues} />

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
                <CurrencySelector
                  disabled={false}
                  selected={false}
                  currency={currencyB}
                  onClick={onCurrencySelectBClick}
                />
              </x.div>

              <NumericalInput id="currencyB" disabled={!currencyB} value={secondValue} onChange={onChangeValues} />

              <x.div w="100%" display="flex" mt={2} justifyContent="flex-end">
                <x.p color="gray155">{new Big(formatUnits(balanceB.data ?? 0n, currencyB?.decimals || 0)).toFixed(6)}</x.p>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      {(currencyA && currencyB) && (
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
      )}

      {currencyB && (
        <x.div display="flex" mb={4}>
          <PrimaryButton
            disabled={isDisabledAllowanceA}
            onClick={() => approveA.write()}
            mr={4}
          >Approve {currencyA.symbol}</PrimaryButton>
          <PrimaryButton
            disabled={isDisabledAllowanceB}
            onClick={() => approveB.write()}
            ml={4}
          >Approve {currencyB.symbol}</PrimaryButton>
        </x.div>
      )}

      <PrimaryButton
        disabled={isDisabledSupply}
        onClick={() => addLiquidity.write()}
      >Supply</PrimaryButton>

      <SelectCurrencyModal
        open={open}
        onClose={() => setOpen(false)}
        currencies={selectingCurrencies}
        onSelect={onSelectCurrency}
      />
    </x.div>
  );
}
