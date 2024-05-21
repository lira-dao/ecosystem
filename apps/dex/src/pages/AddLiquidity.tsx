import { ChangeEvent, useState } from 'react';
import { x } from '@xstyled/styled-components';
import { addresses } from '@lira-dao/web3-utils';
import { useAccount } from 'wagmi';
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


export function AddLiquidity() {
  const account = useAccount();

  const [currencyA, setCurrencyA] = useState<Currency>(currencies[0]);
  const [currencyB, setCurrencyB] = useState<Currency>(currencies[1]);

  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const [isAllowCurrencyADisabled, setIsAllowCurrencyADisabled] = useState<boolean>(false);
  const [isAllowCurrencyBDisabled, setIsAllowCurrencyBDisabled] = useState<boolean>(false);
  const [isSupplyDisabled, setIsSupplyDisabled] = useState<boolean>(false);

  const pair = usePair(currencyA, currencyB);

  const balanceA = useBalance(currencyA.address, account.address);
  const balanceB = useBalance(currencyB.address, account.address);

  const allowanceA = useAllowance(currencyA.address, addresses.arbitrumSepolia.router);
  const allowanceB = useAllowance(currencyB.address, addresses.arbitrumSepolia.router);

  const approveA = useApprove(currencyA.address, addresses.arbitrumSepolia.router, parseUnits(firstValue.toString(), currencyA.decimals));
  const approveB = useApprove(currencyB.address, addresses.arbitrumSepolia.router, parseUnits(secondValue.toString(), currencyB.decimals));

  const addLiquidity = useAddLiquidity(parseUnits(firstValue.toString(), currencyA.decimals), parseUnits(secondValue.toString(), currencyB.decimals));

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFirstValue('');
      setSecondValue('');
      return;
    }

    if (e.target.id === 'currencyA') {
      setFirstValue(e.target.value);
      setSecondValue(
        pair.priceCurrencyB.times(new BigNumber(e.target.value)).toString(),
      );
    } else if (e.target.id === 'currencyB') {
      setSecondValue(e.target.value);
      setFirstValue(
        pair.priceCurrencyA.times(new BigNumber(e.target.value)).toString(),
      );
    }
  };

  return (
    <x.div w="100%" maxWidth="480px" border="1px solid" borderColor="white-a10" borderRadius="16px" padding={4}>
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
            <x.p>1 {currencyA.symbol} = {pair.priceCurrencyA.toString()} {currencyB.symbol}</x.p>
            <x.p>1 {currencyB.symbol} = {pair.priceCurrencyB.toString()} {currencyA.symbol}</x.p>
          </x.div>
          <x.div></x.div>
        </x.div>
      </x.div>

      <x.div display="flex" mb={4}>
        <PrimaryButton
          disabled={isAllowCurrencyADisabled}
          onClick={() => approveA.write()}
          mr={4}
        >Approve {currencyA.symbol}</PrimaryButton>
        <PrimaryButton
          disabled={isAllowCurrencyBDisabled}
          onClick={() => approveB.write()}
          ml={4}
        >Approve {currencyB.symbol}</PrimaryButton>
      </x.div>

      <PrimaryButton disabled={isSupplyDisabled} onClick={() => addLiquidity.write()}>Supply</PrimaryButton>
    </x.div>
  );
}
