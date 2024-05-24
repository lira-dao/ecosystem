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
import Modal from 'react-responsive-modal';
import { useBalance as useBalanceWagmi, useChainId } from 'wagmi';
import { Currency, EthereumAddress } from '@lira-dao/web3-utils';


const modalCustomStyles = {
  modal: {
    top: '20%',
    backgroundColor: '#1B1B1B',
    borderRadius: 16,
    maxWidth: 420,
    minWidth: 420,
  },
  closeIcon: {
    fill: 'white',
  },
};

export function AddLiquidity() {
  const chainId = useChainId();
  const dexAddresses = useDexAddresses();
  const [open, setOpen] = useState(false);
  const [selecting, setSelecting] = useState<number | null>(null);
  const [selectingCurrencies, setSelectingCurrencies] = useState<Currency[]>();

  const [currencyA, setCurrencyA] = useState<Currency>(getCurrencies(chainId)[0]);
  const [currencyB, setCurrencyB] = useState<Currency | undefined>(getCurrencies(chainId)[1]);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

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
    } else {
      setCurrencyB(c);
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
                <CurrencySelector
                  disabled={false}
                  selected={false}
                  currency={currencyB}
                  onClick={onCurrencySelectBClick}
                />
              </x.div>

              <NumericalInput id="currencyB" disabled={false} value={secondValue} onChange={onChangeValues} />

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
      )}

      <PrimaryButton
        disabled={!firstValue || !secondValue || needAllowanceA || needAllowanceB}
        onClick={() => addLiquidity.write()}
      >Supply</PrimaryButton>

      <Modal open={open} onClose={() => setOpen(false)} styles={modalCustomStyles}>
        <x.h1 fontSize="xl">Select Token</x.h1>
        <x.div mt={8}>
          {selectingCurrencies && selectingCurrencies.map((c, i) => (
            <x.div
              key={i}
              display="flex"
              alignItems="center"
              my={4}
              cursor="pointer"
              onClick={() => onSelectCurrency(c)}
            >
              <x.div>
                <x.img src={c.icon} width={48} height={48} />
              </x.div>
              <x.div ml={4}>
                <x.h1>{c.symbol}</x.h1>
              </x.div>
            </x.div>
          ))}
        </x.div>
      </Modal>
    </x.div>
  );
}
