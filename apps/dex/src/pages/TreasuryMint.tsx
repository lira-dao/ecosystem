import { useTheme, x } from '@xstyled/styled-components';
import { useEffect, useMemo, useState } from 'react';
import { StyledTabItem } from '../components/StyledTabItem';
import { InputPanel } from '../components/swap/InputPanel';
import { Container } from '../components/swap/Container';
import { CurrencySelector } from '../components/CurrencySelector';
import { NumericalInput } from '../components/StyledInput';
import { formatUnits, parseUnits } from 'viem';
import { SwapSection } from '../components/swap/SwapSection';
import { Currency } from '@lira-dao/web3-utils';
import { getCurrencies, getTreasuryCurrencies } from '../utils';
import { useChainId } from 'wagmi';
import { SelectCurrencyModal } from '../components/modal/SelectCurrencyModal';
import { useBalance } from '../hooks/useBalance';
import { useParams } from 'react-router-dom';
import { useTreasuryToken } from '../hooks/useTreasuryToken';
import { useApprove } from '../hooks/useApprove';
import { useAllowance } from '../hooks/useAllowance';
import { useSnackbar } from 'notistack';
import BigNumber from 'bignumber.js';
import { SwapHeader } from '../components/swap/SwapHeader';
import { PrimaryButtonWithLoader } from '../components/PrimaryButtonWithLoader';


enum TreasuryHeaderTab {
  Mint,
  Burn
}

export function TreasuryMint() {
  const th = useTheme();
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [active, setActive] = useState<TreasuryHeaderTab>(params.action === 'mint' ? TreasuryHeaderTab.Mint : TreasuryHeaderTab.Burn);
  const [open, setOpen] = useState(false);
  const [isActionDisabled, setIsActionDisabled] = useState<boolean>(true);

  const chainId = useChainId();

  const [firstValue, setFirstValue] = useState<string>('');
  const [secondValue, setSecondValue] = useState<string>('');

  const [currencyA, setCurrencyA] = useState<Currency>(getTreasuryCurrencies(chainId).find(t => t.address === params.address) || getTreasuryCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(getCurrencies(chainId)[0]);

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
      setCurrencyB(getCurrencies(chainId)[0]);
    } else if (c.paired.includes('LIRA')) {
      setCurrencyB(getCurrencies(chainId)[1]);
    }

    setFirstValue('');
    setOpen(false);
  };

  const onSetPercentage = (percentage: bigint) => {
    switch (percentage) {
      case 25n:
      case 50n:
      case 75n:
        setFirstValue(((new BigNumber(balanceA.data?.toString() || '0').times(percentage.toString()).div(100)).div(new BigNumber(10).pow(18))).toString());

        setFirstValue(formatUnits(((balanceA.data || 0n) * percentage) / 100n, 18));
        break;
      case 100n:
        setFirstValue(new BigNumber(balanceA.data?.toString() || '0').div(new BigNumber(10).pow(18)).toString());
        break;
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
    <x.div w="100%" maxWidth="480px" borderRadius="16px" padding={4}>
      <SwapHeader title="Treasury" />

      <x.div display="flex" pt={8}>
        <StyledTabItem
          $active={active === TreasuryHeaderTab.Mint}
          onClick={onMintClick}
        >MINT</StyledTabItem>
        <StyledTabItem
          $active={active === TreasuryHeaderTab.Burn}
          onClick={onBurnClick}
        >BURN</StyledTabItem>
      </x.div>


      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">{active === TreasuryHeaderTab.Mint ? 'Mint' : 'Burn'}</x.p>
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

              {active === TreasuryHeaderTab.Mint ? (
                <x.div w="100%" display="flex" mt={2} justifyContent="flex-end">
                  <x.p color="gray155">{new BigNumber(formatUnits(balanceA.data ?? 0n, currencyA.decimals)).toFixed(6, 1)}</x.p>
                </x.div>
              ) : (
                <x.div w="100%" display="flex" mt={2} justifyContent="space-between">
                  <x.div display="flex">
                    <x.p
                      mr={2}
                      cursor="pointer"
                      color={{ _: 'gray155', hover: 'white' }}
                      onClick={() => onSetPercentage(25n)}
                    >25%
                    </x.p>
                    <x.p
                      mr={2}
                      cursor="pointer"
                      color={{ _: 'gray155', hover: 'white' }}
                      onClick={() => onSetPercentage(50n)}
                    >50%
                    </x.p>
                    <x.p
                      mr={2}
                      cursor="pointer"
                      color={{ _: 'gray155', hover: 'white' }}
                      onClick={() => onSetPercentage(75n)}
                    >75%
                    </x.p>
                    <x.p
                      mr={2}
                      cursor="pointer"
                      color={{ _: 'gray155', hover: 'white' }}
                      onClick={() => onSetPercentage(100n)}
                    >100%
                    </x.p>
                  </x.div>
                  <x.div>
                    <x.p color="gray155">{new BigNumber(formatUnits(balanceA.data ?? 0n, 18)).toFixed(6, 1)}</x.p>
                  </x.div>
                </x.div>
              )}
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <SwapSection mt={4}>
        <InputPanel>
          <Container>
            <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
              <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
                <x.p color="gray155" userSelect="none">For</x.p>
                <CurrencySelector
                  disabled={true}
                  selected={false}
                  currency={currencyB}
                  onClick={() => {
                  }}
                />
              </x.div>

              <NumericalInput
                id="currencyB"
                disabled={true}
                value={secondValue}
                onChange={() => {
                }}
              />

              <x.div w="100%" display="flex" justifyContent="flex-end" mt={2}>
                <x.p color="gray155">{new BigNumber(formatUnits(balanceB.data ?? 0n, currencyB.decimals)).toFixed(6, 1)}</x.p>
              </x.div>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <x.div mt={4}>
        <x.div>
          <x.div>
            <x.p>{active === TreasuryHeaderTab.Mint ? 'Lock' : 'Unlock'}: {formatUnits(active === TreasuryHeaderTab.Mint ? treasuryToken.quoteMint.data?.[1] || 0n : treasuryToken.quoteBurn.data?.[0] || 0n, currencyB.decimals)} {currencyB.symbol}</x.p>
            <x.p>Fee: {formatUnits(active === TreasuryHeaderTab.Mint ? treasuryToken.quoteMint.data?.[2] || 0n : treasuryToken.quoteBurn.data?.[1] || 0n, currencyB.decimals)} {currencyB.symbol}</x.p>
          </x.div>
          <x.div></x.div>
        </x.div>
      </x.div>

      {(active === TreasuryHeaderTab.Mint && needAllowance) && (
        <x.div display="flex" mt={4} mb={2} h="80px" alignItems="center" justifyContent="center">
          <PrimaryButtonWithLoader
            isLoading={isAllowCurrencyDisabled}
            isDisabled={isAllowCurrencyDisabled}
            text={`Approve ${currencyB.symbol}`}
            onClick={() => approve.write()}
          />
        </x.div>
      )}

      {(active === TreasuryHeaderTab.Burn || !needAllowance) && (
        <x.div display="flex" mt={4} h="80px" alignItems="center" justifyContent="center">
          <PrimaryButtonWithLoader
            isLoading={isActionDisabled}
            isDisabled={firstValue === '' || !firstValue}
            text={active === TreasuryHeaderTab.Mint ? 'MINT' : 'BURN'}
            onClick={() => active === TreasuryHeaderTab.Mint ? treasuryToken.mint.write() : treasuryToken.burn.write()}
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
