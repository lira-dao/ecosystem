import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { x } from '@xstyled/styled-components';
import { Box, Card, Divider, IconButton, Typography } from '@mui/material';
import { SwapVert } from '@mui/icons-material';
import { Currency, EthereumAddress } from '@lira-dao/web3-utils';
import BigNumber from 'bignumber.js';
import { useSnackbar } from 'notistack';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useBalance as useBalanceWagmi, useChainId } from 'wagmi';
import { getCurrencies, getCurrencyByAddress, getPairedCurrencies } from '../utils';
import { useApprove } from '../hooks/useApprove';
import { useAllowance } from '../hooks/useAllowance';
import { useBalance } from '../hooks/useBalance';
import { useDexAddresses } from '../hooks/useDexAddresses';
import { useDexPairs } from '../hooks/useDexPairs';
import { useGetAmountsIn, useGetAmountsOut } from '../hooks/useGetAmountsOut';
import { useSwap } from '../hooks/useSwap';
import { usePair } from '../hooks/usePair';
import { useFetchPrices } from '../hooks/usePrices';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';
import { CurrencyInput } from '../components/swap/CurrencyInput';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { SwapHeader } from '../components/swap/SwapHeader';
import SlippageInput from '../components/swap/SlippageInput';
import TradePriceImpact from '../components/swap/PriceImpact';

export function Swap() {
  const params = useParams<{ pool: EthereumAddress }>();
  const pairs = useDexPairs();
  const pool = params.pool ? pairs[params.pool] : undefined;
  const currency0 = pool ? getCurrencyByAddress(pool.tokens[1]) : undefined;
  const currency1 = pool ? getCurrencyByAddress(pool.tokens[0]) : undefined;

  const chainId = useChainId();
  const dexAddresses = useDexAddresses();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>(
    [],
  );

  const [currencyA, setCurrencyA] = useState<Currency>(
    currency0 ? currency0 : getCurrencies(chainId)[5],
  );
  const [currencyB, setCurrencyB] = useState<Currency | undefined>(
    currency1 ? currency1 : getCurrencies(chainId)[0],
  );

  const [firstValue, setFirstValue] = useState<string>('');
  const [secondValue, setSecondValue] = useState<string>('');

  const allowance1 = useAllowance(currencyA.address, dexAddresses.router);

  const [isSwapDisabled, setIsSwapDisabled] = useState<boolean>(true);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB?.address);

  const [amountOut, setAmountOut] = useState<bigint>(0n);
  const [amountIn, setAmountIn] = useState<bigint>(0n);

  const [slippage, setSlippage] = useState<number>(0.5);

  const [approveConfirmed, setApproveConfirmed] = useState(false);

  const amountsOut = useGetAmountsOut(
    [currencyA.address, currencyB?.address || '0x0'],
    amountOut,
  );
  const amountsIn = useGetAmountsIn(
    [currencyA.address, currencyB?.address || '0x0'],
    amountIn,
  );

  const approve = useApprove(
    currencyA.address,
    dexAddresses.router,
    parseUnits(firstValue.toString(), currencyA.decimals),
  );

  const pair = usePair(currencyA, currencyB);
  const swap = useSwap(
    [currencyA.address, currencyB?.address || '0x0'],
    parseUnits(firstValue.toString(), currencyA.decimals),
    currencyA.isNative,
    currencyB?.isNative,
    slippage,
  );

  const isAllowCurrencyADisabled = useMemo(
    () => approve.isPending || allowance1.isPending,
    [approve, allowance1],
  );

  const account = useAccount();
  const accountBalance = useBalanceWagmi({ address: account.address });

  const insufficientBalanceA = useMemo(() => {
    if (currencyA.isNative) {
      return new BigNumber(
        parseUnits(firstValue, currencyA.decimals).toString(),
      ).gt(new BigNumber(accountBalance.data?.value.toString() || '0'));
    } else {
      return new BigNumber(
        parseUnits(firstValue, currencyA.decimals).toString(),
      ).gt(new BigNumber(balanceA.data?.toString() || '0'));
    }
  }, [
    accountBalance.data?.value,
    balanceA.data,
    currencyA.decimals,
    currencyA.isNative,
    firstValue,
  ]);

  const needAllowance = useMemo(
    () =>
      parseUnits(firstValue.toString(), currencyA.decimals) > 0 &&
      !currencyA.isNative &&
      allowance1.data !== undefined &&
      allowance1.data < parseUnits(firstValue.toString(), currencyA.decimals),
    [allowance1.data, currencyA.decimals, currencyA.isNative, firstValue],
  );

  const { data: pricesData } = useFetchPrices();

  useEffect(() => {
    if (amountsOut.data) {
      setSecondValue(
        formatUnits(amountsOut.data[1], currencyB?.decimals || 18),
      );
    }
  }, [amountsOut, currencyB?.decimals]);

  useEffect(() => {
    if (amountsIn?.data?.[0]) {
      setFirstValue(formatUnits(amountsIn.data[0], currencyA.decimals));
    }
  }, [amountsIn, currencyA.decimals]);

  useEffect(() => {
    if (swap.isPending) {
      setIsSwapDisabled(true);
    } else {
      setIsSwapDisabled(false);
    }
  }, [swap.isPending]);

  useEffect(() => {
    if (approve.confirmed && !approveConfirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      allowance1.refetch();
      setApproveConfirmed(true);
    } else if (!approve.confirmed && approveConfirmed) {
      setApproveConfirmed(false);
    }
  }, [approve.confirmed, approveConfirmed, allowance1, enqueueSnackbar]);

  useEffect(() => {
    if (swap.confirmed) {
      enqueueSnackbar('Swap confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      swap.reset();
      balanceA.refetch();
      balanceB.refetch();
      accountBalance.refetch();
      allowance1.refetch();
      pair.refetchReserves();
      setAmountOut(0n);
      setAmountIn(0n);
      setFirstValue('');
      setSecondValue('');
    }
  }, [
    swap.confirmed,
    accountBalance,
    allowance1,
    balanceA,
    balanceB,
    enqueueSnackbar,
    pair,
    swap,
  ]);

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

  const computePrice = (currency: Currency) => pricesData?.find(
    (price) => price.symbol === currency.symbol,
  )?.price ?? '0';

  const computePriceImpact = (): string => {
    if (!pair?.reserveA || !pair.reserveB || !firstValue || !amountsOut.data) return '0';
  
    const amountInBN = new BigNumber(parseUnits(firstValue, currencyA.decimals).toString());
      
    const reserveA = new BigNumber(pair.reserveA.toString());
    const reserveB = new BigNumber(pair.reserveB.toString());
      
    let newReserveA = reserveA.plus(amountInBN);
    let newReserveB = reserveB.minus(new BigNumber(amountsOut.data[1].toString()));
  
    newReserveA = BigNumber.maximum(newReserveA, 0);
    newReserveB = BigNumber.maximum(newReserveB, 0);
  
    const newPriceA = newReserveB.div(newReserveA);
    const oldPriceA = reserveB.div(reserveA);
  
    const priceImpact = newPriceA.minus(oldPriceA).div(oldPriceA).times(100);
  
    return priceImpact.toFixed();
  };

  const priceImpact = useMemo(
    computePriceImpact,
    [pair?.reserveA, pair?.reserveB, firstValue, amountsOut.data]
  );

  return (
    <x.div w="100%" maxWidth="600px" borderRadius="16px" padding={4}>
      <SwapHeader title="Swap" showBack={!!params.pool} />

      <Box width="100%" mx="auto">
        <Card sx={{ borderRadius: '8px', p: 1, backgroundColor: 'background.paper' }}>

          <CurrencyInput
            balance={
              currencyA.isNative
                ? accountBalance.data?.value || 0n
                : balanceA.data ?? 0n
            }
            currency={currencyA}
            disabled={false}
            formattedBalance={new BigNumber(
              formatUnits(
                currencyA.isNative
                  ? accountBalance.data?.value || 0n
                  : balanceA.data ?? 0n,
                currencyA.decimals,
              ),
            ).toFixed(6, 1)}
            id="currencyA"
            insufficientBalance={insufficientBalanceA}
            onChangeValue={(e) => onCurrencyAChange(e.target.value)}
            onCurrencySelectClick={onCurrencySelectAClick}
            onSetPercentage={onCurrencyAChange}
            selected={false}
            showPercentages
            title="You Pay"
            value={firstValue}
            price={computePrice(currencyA)}
          />

          <Box display="flex" justifyContent="center" mt={-2} mb={-2}>
            <IconButton
              onClick={switchCurrencies}
              sx={{
                color: 'white',
                border: 0,
                '&:hover': {
                  backgroundColor: 'rgba(144, 202, 249, 0.1)'
                },
              }}
            >
              <SwapVert />
            </IconButton>
          </Box>

          <CurrencyInput
            balance={
              currencyB?.isNative
                ? accountBalance.data?.value || 0n
                : balanceB.data ?? 0n
            }
            currency={currencyB}
            disabled={false}
            formattedBalance={new BigNumber(
              formatUnits(
                currencyB?.isNative
                  ? accountBalance.data?.value || 0n
                  : balanceB.data ?? 0n,
                currencyB?.decimals || 18,
              ),
            ).toFixed(6, 1)}
            id="currencyB"
            insufficientBalance={false}
            onChangeValue={(e) => onCurrencyBChange(e.target.value)}
            onCurrencySelectClick={onCurrencySelectBClick}
            onSetPercentage={onCurrencyBChange}
            selected={false}
            title="You Receive"
            value={secondValue}
            price={currencyB && computePrice(currencyB)}
          />

          {currencyB && (
            <>
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

              <SlippageInput
                slippage={slippage}
                setSlippage={setSlippage}
                expectedOutput={secondValue}
                outputToken={currencyB.symbol}
              />
            </>
          )}

          {currencyA && currencyB && firstValue && (
            <TradePriceImpact priceImpact={priceImpact}></TradePriceImpact>
          )}

          {currencyA && currencyB && (
            <Box mt={2} p={2}>
              <Typography variant="body1" gutterBottom>
                Prices
              </Typography>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  1 {currencyA.symbol} ={' '}
                  {pair.priceCurrencyA.toFixed(
                    pair.priceCurrencyA.lt(1) ? 8 : 2,
                    1,
                  )}{' '}
                  {currencyB.symbol}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1 {currencyB.symbol} ={' '}
                  {pair.priceCurrencyB.toFixed(
                    pair.priceCurrencyB.lt(1) ? 8 : 2,
                    1,
                  )}{' '}
                  {currencyA.symbol}
                </Typography>
              </Box>
            </Box>
          )}
        </Card>
      </Box>

      {needAllowance && !insufficientBalanceA && (
        <x.div
          display="flex"
          mt={4}
          mb={2}
          h="80px"
          alignItems="center"
          justifyContent="center"
        >
          <PrimaryButtonWithLoader
            isLoading={isAllowCurrencyADisabled}
            isDisabled={isAllowCurrencyADisabled}
            text="Approve"
            onClick={() => approve.write()}
          />
        </x.div>
      )}

      {!needAllowance && !insufficientBalanceA && (
        <x.div
          display="flex"
          mt={4}
          h="80px"
          alignItems="center"
          justifyContent="center"
        >
          <PrimaryButtonWithLoader
            isLoading={isSwapDisabled}
            isDisabled={!firstValue && !secondValue}
            text="Swap"
            onClick={() => swap.write()}
          />
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
