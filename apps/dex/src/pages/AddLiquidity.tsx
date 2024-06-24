import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { x } from '@xstyled/styled-components';
import { formatUnits, parseUnits } from 'viem';
import { PrimaryButton } from '../components/PrimaryButton';
import { getCurrencies, getCurrencyByAddress, getPairedCurrencies } from '../utils';
import { usePair } from '../hooks/usePair';
import { useBalance } from '../hooks/useBalance';
import { useAllowance } from '../hooks/useAllowance';
import { useApprove } from '../hooks/useApprove';
import { useAddLiquidity } from '../hooks/useAddLiquidity';
import BigNumber from 'bignumber.js';
import { useDexAddresses } from '../hooks/useDexAddresses';
import { useAccount, useBalance as useBalanceWagmi, useChainId } from 'wagmi';
import { Currency, EthereumAddress } from '@lira-dao/web3-utils';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';
import { useSnackbar } from 'notistack';
import { useDebounce } from 'use-debounce';
import { useParams } from 'react-router-dom';
import { useDexPairs } from '../hooks/useDexPairs';
import { CurrencyInput } from '../components/swap/CurrencyInput';


export function AddLiquidity() {
  const params = useParams<{ pool: EthereumAddress }>();
  const pairs = useDexPairs();
  const pool = params.pool ? pairs[params.pool] : undefined;
  const currency0 = pool ? getCurrencyByAddress(pool.tokens[0]) : undefined;
  const currency1 = pool ? getCurrencyByAddress(pool.tokens[1]) : undefined;

  const { enqueueSnackbar } = useSnackbar();
  const chainId = useChainId();
  const dexAddresses = useDexAddresses();
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>([]);
  const [isDisabledAllowanceA, setIsDisabledAllowanceA] = useDebounce<boolean>(false, 500);
  const [isDisabledAllowanceB, setIsDisabledAllowanceB] = useDebounce<boolean>(false, 500);
  const [isDisabledSupply, setIsDisabledSupply] = useDebounce<boolean>(false, 500, { leading: true });

  const [currencyA, setCurrencyA] = useState<Currency>(currency0 ? currency0 : getCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency | undefined>(currency1);

  const [firstValue, setFirstValue] = useState<string>('');
  const [secondValue, setSecondValue] = useState<string>('');

  const pair = usePair(currencyA, currencyB);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB?.address);

  const allowanceA = useAllowance(currencyA.address, dexAddresses.router);
  const allowanceB = useAllowance(currencyB?.address as EthereumAddress, dexAddresses.router);

  const approveA = useApprove(currencyA.address, dexAddresses.router, parseUnits(firstValue.toString(), currencyA.decimals));
  const approveB = useApprove(currencyB?.address as EthereumAddress, dexAddresses.router, parseUnits(secondValue.toString(), currencyB?.decimals || 18));

  const account = useAccount();
  const accountBalance = useBalanceWagmi({ address: account.address });

  const insufficientBalanceA = useMemo(() => {
    if (currencyA.isNative) {
      return new BigNumber(parseUnits(firstValue, currencyA.decimals).toString()).gt(new BigNumber(accountBalance.data?.value.toString() || '0'));
    } else {
      return new BigNumber(parseUnits(firstValue, currencyA.decimals).toString()).gt(new BigNumber(balanceA.data?.toString() || '0'));
    }
  }, [accountBalance.data?.value, balanceA.data, currencyA.decimals, currencyA.isNative, firstValue]);

  const insufficientBalanceB = useMemo(() => {
    if (currencyB?.isNative) {
      return new BigNumber(parseUnits(secondValue, currencyB?.decimals || 18).toString()).gt(new BigNumber(accountBalance.data?.value.toString() || '0'));
    } else {
      return new BigNumber(parseUnits(secondValue, currencyB?.decimals || 18).toString()).gt(new BigNumber(balanceB.data?.toString() || '0'));
    }
  }, [accountBalance.data?.value, balanceB.data, currencyB?.decimals, currencyB?.isNative, secondValue]);

  const addLiquidity = useAddLiquidity(
    currencyA,
    parseUnits(firstValue.toString(), currencyA.decimals),
    currencyB,
    parseUnits(secondValue.toString(), currencyB?.decimals || 18),
  );

  const needAllowanceA = useMemo(() =>
      parseUnits(firstValue.toString(), currencyA.decimals) > 0 &&
      !currencyA.isNative &&
      allowanceA.data !== undefined &&
      allowanceA.data < parseUnits(firstValue.toString(), currencyA.decimals),
    [allowanceA, firstValue]);

  const needAllowanceB = useMemo(() =>
      currencyB?.decimals &&
      parseUnits(secondValue.toString(), currencyB.decimals) > 0 &&
      !currencyB.isNative &&
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
          pair.priceCurrencyA.times(new BigNumber(e.target.value)).toFixed(),
        );
      }

    } else if (e.target.id === 'currencyB') {
      setSecondValue(e.target.value);
      if (pair.priceCurrencyB.gt(0)) {
        setFirstValue(
          pair.priceCurrencyB.times(new BigNumber(e.target.value)).toFixed(),
        );
      }
    }
  };

  const onSetPercentageA = (value: string) => {
    setFirstValue(value);

    if (pair.priceCurrencyB.gt(0)) {
      setSecondValue(
        pair.priceCurrencyA.times(new BigNumber(value)).toFixed(),
      );
    }
  };

  const onSetPercentageB = (value: string) => {
    setSecondValue(value);

    if (pair.priceCurrencyB.gt(0)) {
      setFirstValue(
        pair.priceCurrencyB.times(new BigNumber(value)).toFixed(),
      );
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

      <CurrencyInput
        balance={currencyA.isNative ? accountBalance.data?.value || 0n : balanceA.data ?? 0n}
        currency={currencyA}
        disabled={false}
        formattedBalance={new BigNumber(formatUnits(currencyA.isNative ? accountBalance.data?.value || 0n : balanceA.data ?? 0n, currencyA.decimals)).toFixed(6, 1)}
        id="currencyA"
        insufficientBalance={insufficientBalanceA}
        onChangeValue={onChangeValues}
        onCurrencySelectClick={onCurrencySelectAClick}
        onSetPercentage={onSetPercentageA}
        selected={false}
        showPercentages
        title="Deposit"
        value={firstValue}
      />

      <CurrencyInput
        balance={currencyB?.isNative ? accountBalance.data?.value || 0n : balanceB.data ?? 0n}
        currency={currencyB}
        disabled={false}
        formattedBalance={new BigNumber(formatUnits(currencyB?.isNative ? accountBalance.data?.value || 0n : balanceB.data ?? 0n, currencyB?.decimals || 18)).toFixed(6, 1)}
        id="currencyB"
        insufficientBalance={insufficientBalanceB}
        onChangeValue={onChangeValues}
        onCurrencySelectClick={onCurrencySelectBClick}
        onSetPercentage={onSetPercentageB}
        selected={false}
        showPercentages
        title="Deposit"
        value={secondValue}
      />

      {(currencyA && currencyB) && (
        <x.div mb={8}>
          <x.p>Prices</x.p>

          <x.div>
            <x.div>
              <x.p>1 {currencyA.symbol} = {pair.priceCurrencyA.toFixed(pair.priceCurrencyA.lt(1) ? 8 : 2, 1)} {currencyB.symbol}</x.p>
              <x.p>1 {currencyB.symbol} = {pair.priceCurrencyB.toFixed(pair.priceCurrencyB.lt(1) ? 8 : 2, 1)} {currencyA.symbol}</x.p>
            </x.div>
            <x.div></x.div>
          </x.div>
        </x.div>
      )}

      {currencyB && (
        <x.div display="flex" mb={4}>
          {!currencyA.isNative && (
            <PrimaryButton
              disabled={isDisabledAllowanceA}
              onClick={() => approveA.write()}
              mr={currencyB.isNative ? 0 : 4}
            >Approve {currencyA.symbol}</PrimaryButton>
          )}
          {!currencyB.isNative && (
            <PrimaryButton
              disabled={isDisabledAllowanceB}
              onClick={() => approveB.write()}
              ml={currencyA.isNative ? 0 : 4}
            >Approve {currencyB.symbol}</PrimaryButton>
          )}
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
