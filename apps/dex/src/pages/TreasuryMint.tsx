import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Card, CardContent, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import BigNumber from 'bignumber.js';
import { useSnackbar } from 'notistack';
import { formatUnits, parseUnits } from 'viem';
import { useChainId } from 'wagmi';
import { Currency } from '@lira-dao/web3-utils';
import { useAllowance } from '../hooks/useAllowance';
import { useApprove } from '../hooks/useApprove';
import { useBalance } from '../hooks/useBalance';
import { usePair } from '../hooks/usePair';
import { useTreasuryToken } from '../hooks/useTreasuryToken';
import { getCurrencies, getTreasuryCurrencies } from '../utils';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';
import { CurrencyInput } from '../components/swap/CurrencyInput';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';
import { SectionHeader } from '../components/swap/SectionHeader';

enum TreasuryHeaderTab {
  Mint,
  Burn
}

export function TreasuryMint() {
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();

  const [active, setActive] = useState<TreasuryHeaderTab>(params.action === 'mint' ? TreasuryHeaderTab.Mint : TreasuryHeaderTab.Burn);
  const [open, setOpen] = useState(false);
  const [isActionDisabled, setIsActionDisabled] = useState<boolean>(true);

  const chainId = useChainId();

  const [firstValue, setFirstValue] = useState<string>('');
  const [secondValue, setSecondValue] = useState<string>('');

  const [currencyA, setCurrencyA] = useState<Currency>(getTreasuryCurrencies(chainId).find(t => t.address === params.address) || getTreasuryCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(getCurrencies(chainId)[0]);

  const pair = usePair(currencyA, currencyB);

  const balanceA = useBalance(currencyA.address);
  const balanceB = useBalance(currencyB?.address);

  const treasuryToken = useTreasuryToken(currencyA.address, parseUnits(firstValue, currencyA.decimals));

  const allowance = useAllowance(currencyB.address, currencyA.address);
  const approve = useApprove(
    currencyB.address,
    currencyA.address,
    treasuryToken.quoteMint.data?.[0] || 0n,
  );

  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>([]);

  const isAllowCurrencyDisabled = useMemo(() => approve.isPending || allowance.isPending, [approve, allowance]);

  const needAllowance = useMemo(() =>
      parseUnits(secondValue.toString(), currencyB.decimals) > 0 &&
      allowance.data !== undefined &&
      allowance.data < parseUnits(secondValue.toString(), currencyB.decimals),
    [allowance, firstValue]);

  useEffect(() => {
    if (treasuryToken.quoteMint || treasuryToken.quoteBurn) {
      setSecondValue(formatUnits(active === TreasuryHeaderTab.Mint ? treasuryToken.quoteMint.data?.[0] || 0n : treasuryToken.quoteBurn.data?.[0] || 0n, currencyB.decimals));
    }
  }, [treasuryToken.quoteMint]);

  useEffect(() => {
    if (treasuryToken.mint.isPending || treasuryToken.burn.isPending) {
      setIsActionDisabled(true);
    } else {
      setIsActionDisabled(false);
    }
  }, [treasuryToken.mint.isPending, treasuryToken.burn.isPending]);

  useEffect(() => {
    if (approve.confirmed) {
      enqueueSnackbar('Approve confirmed!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      allowance.refetch();
    }
  }, [approve.confirmed]);

  useEffect(() => {
    if (treasuryToken.mint.confirmed || treasuryToken.burn.confirmed) {
      enqueueSnackbar(`${active === TreasuryHeaderTab.Mint ? 'Mint' : 'Burn'} Confirmed!`, {
        autoHideDuration: 3000,
        variant: 'success',
      });
      balanceA.refetch();
      balanceB.refetch();
      active === TreasuryHeaderTab.Mint
        ? treasuryToken.mint.reset()
        : treasuryToken.burn.reset();

      setFirstValue('');
      setSecondValue('');
    }
  }, [treasuryToken.mint.confirmed, treasuryToken.burn.confirmed]);

  const onCurrencyChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFirstValue(e.target.value);

    if (!e.target.value) {
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
      setCurrencyB(getCurrencies(chainId)[0]);
    } else if (c.paired.includes('LIRA')) {
      setCurrencyB(getCurrencies(chainId)[1]);
    }

    setFirstValue('');
    setOpen(false);
  };

  const onSetPercentage = (value: string) => {
    if (active === TreasuryHeaderTab.Burn) {
      const percentage = new BigNumber(value);
      const balanceInUnits = new BigNumber(balanceA.data?.toString() || '0');

      const normalizedBalance = balanceInUnits.div(new BigNumber(10).pow(currencyA.decimals));

      const calculatedFirstValue = normalizedBalance
        .times(percentage)
        .toFixed(currencyA.decimals, BigNumber.ROUND_DOWN);

      const normalizedPriceCurrencyB = new BigNumber(pair.priceCurrencyB)
        .times(new BigNumber(10).pow(currencyA.decimals));

      const calculatedSecondValue = new BigNumber(calculatedFirstValue)
        .times(normalizedPriceCurrencyB)
        .div(new BigNumber(10).pow(currencyA.decimals))
        .toFixed(currencyB.decimals, BigNumber.ROUND_DOWN);

      setFirstValue(new BigNumber(calculatedFirstValue).toFixed().replace(/\.?0+$/, ''));
      setSecondValue(new BigNumber(calculatedSecondValue).toFixed().replace(/\.?0+$/, ''));
    }
  };

  const onMintClick = () => {
    setActive(TreasuryHeaderTab.Mint);
    setFirstValue('');
    setSecondValue('');
  };

  const onBurnClick = () => {
    setActive(TreasuryHeaderTab.Burn);
    setFirstValue('');
    setSecondValue('');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', borderRadius: '16px', p: 4 }}>
      <SectionHeader title="Treasury" />

      <Box width="100%" mx="auto">
        <Card sx={{ p: 1, backgroundColor: 'background.paper' }}>
          <Box sx={{ display: 'flex', pt: 2, px: 2 }}>
            <ToggleButtonGroup
              color="primary"
              value={active}
              onChange={(e, value) => {
                if (value !== null) {
                  setActive(value);
                }
              }}
              sx={{ mb: 2 }}
              size="small"
              exclusive
              fullWidth
            >
              <ToggleButton value={TreasuryHeaderTab.Mint} onClick={onMintClick}>Mint</ToggleButton>
              <ToggleButton value={TreasuryHeaderTab.Burn} onClick={onBurnClick}>Burn</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <CurrencyInput
            balance={balanceA.data || 0n}
            currency={currencyA}
            disabled={false}
            formattedBalance={new BigNumber(formatUnits(balanceA.data || 0n, currencyA.decimals)).toFixed(6, 1)}
            id="currencyA"
            insufficientBalance={false}
            isDisabledCurrencySelector={false}
            onChangeValue={onCurrencyChange}
            onCurrencySelectClick={onCurrencySelectClick}
            onSetPercentage={(e) => onSetPercentage(e)}
            selected={false}
            showPercentages={active === TreasuryHeaderTab.Mint ? false : true}
            title={active === TreasuryHeaderTab.Mint ? 'Mint' : 'Burn'}
            value={firstValue}
          />
          <CurrencyInput
            balance={balanceB.data || 0n}
            currency={currencyB}
            disabled={true}
            formattedBalance={new BigNumber(formatUnits(balanceB.data || 0n, currencyB.decimals)).toFixed(6, 1)}
            id="currencyB"
            isDisabledCurrencySelector={true}
            insufficientBalance={false}
            onChangeValue={() => {}}
            onSetPercentage={() => {}}
            selected={false}
            title="For"
            value={secondValue}
          />
        </Card>
      </Box>

      <Card sx={{ mt: 2 }}>
        <CardContent sx={{ '&:last-child': { p: 2 } }}>
          <Box display="flex" justifyContent="space-between">
            <Typography>{active === TreasuryHeaderTab.Mint ? 'Lock' : 'Unlock'}</Typography>
            <Typography>{formatUnits(active === TreasuryHeaderTab.Mint ? treasuryToken.quoteMint.data?.[1] || 0n : treasuryToken.quoteBurn.data?.[0] || 0n, currencyB.decimals)} {currencyB.symbol}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography>Fee</Typography>
            <Typography>{formatUnits(active === TreasuryHeaderTab.Mint ? treasuryToken.quoteMint.data?.[2] || 0n : treasuryToken.quoteBurn.data?.[1] || 0n, currencyB.decimals)} {currencyB.symbol}</Typography>
          </Box>
        </CardContent>
      </Card>

      {(active === TreasuryHeaderTab.Mint && needAllowance) && (
        <Box sx={{ display: 'flex', mt: 4, mb: 2, height: '80px', alignItems: 'center', justifyContent: 'center' }}>
          <PrimaryButtonWithLoader
            isLoading={isAllowCurrencyDisabled}
            isDisabled={isAllowCurrencyDisabled}
            text={`Approve ${currencyB.symbol}`}
            onClick={() => approve.write()}
          />
        </Box>
      )}

      {(active === TreasuryHeaderTab.Burn || !needAllowance) && (
        <Box sx={{ display: 'flex', mt: 4, height: '80px', alignItems: 'center', justifyContent: 'center' }}>
          <PrimaryButtonWithLoader
            isLoading={isActionDisabled}
            isDisabled={firstValue === '' || !firstValue}
            text={active === TreasuryHeaderTab.Mint ? 'MINT' : 'BURN'}
            onClick={() => active === TreasuryHeaderTab.Mint ? treasuryToken.mint.write() : treasuryToken.burn.write()}
          />
        </Box>
      )}

      <SelectCurrencyModal
        open={open}
        onClose={() => setOpen(false)}
        currencies={selectingCurrencies}
        onSelect={onSelectCurrency}
      />
    </Box>
  );
}
