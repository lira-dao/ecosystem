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


export function AddLiquidity() {
  const account = useAccount();
  const [firstValue, setFirstValue] = useState<number | string>('');
  const [secondValue, setSecondValue] = useState<number | string>('');

  const [isAllowCurrencyADisabled, setIsAllowCurrencyADisabled] = useState<boolean>(false);
  const [isAllowCurrencyBDisabled, setIsAllowCurrencyBDisabled] = useState<boolean>(false);
  const [isSupplyDisabled, setIsSupplyDisabled] = useState<boolean>(false);

  const pair = usePair(currencies[0], currencies[1]);

  const balanceA = useBalance(addresses.arbitrumSepolia.ldt as `0x${string}`, account.address);
  const balanceB = useBalance(addresses.arbitrumSepolia.weth as `0x${string}`, account.address);

  const allowanceA = useAllowance(addresses.arbitrumSepolia.ldt as `0x${string}`, account.address, addresses.arbitrumSepolia.router as `0x${string}`);
  const allowanceB = useAllowance(addresses.arbitrumSepolia.weth as `0x${string}`, account.address, addresses.arbitrumSepolia.router as `0x${string}`);

  const approveA = useApprove(addresses.arbitrumSepolia.ldt as `0x${string}`, addresses.arbitrumSepolia.router as `0x${string}`, parseUnits(firstValue.toString(), 18));
  const approveB = useApprove(addresses.arbitrumSepolia.weth as `0x${string}`, addresses.arbitrumSepolia.router as `0x${string}`, parseUnits(secondValue.toString(), 18));

  const addLiquidity = useAddLiquidity(parseUnits(firstValue.toString(), 18), parseUnits(secondValue.toString(), 18));

  console.log('allowanceA', allowanceA.data);
  console.log('allowanceB', allowanceB.data);

  const onChangeValues = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setFirstValue('');
      setSecondValue('');
      return;
    }

    if (e.target.id === 'currencyA') {
      setFirstValue(e.currentTarget.value);
      setSecondValue((parseFloat(e.target.value) * parseFloat(pair.reserveB.toString())) / parseFloat(pair.reserveA.toString()));
    } else if (e.target.id === 'currencyB') {
      setSecondValue(e.currentTarget.value);
      setFirstValue((parseFloat(e.target.value) * parseFloat(pair.reserveA.toString())) / parseFloat(pair.reserveB.toString()));
    }
  };

  return (
    <x.div w="100%" maxWidth="480px" border="1px solid" borderColor="white-a10" borderRadius="16px" padding={4}>
      <x.div display="flex" justifyContent="center" mt={2}>
        <x.p>Add Liquidity</x.p>
      </x.div>

      <SwapSection mt={6} mb={4}>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <NumericalInput id="currencyA" disabled={false} value={firstValue} onChange={onChangeValues} />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencies[0]} />
            </x.div>
            <x.div mt={2} textAlign="right">
              <x.p>Balance: {formatUnits(balanceA ?? 0n, 18)}</x.p>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <SwapSection mt={4} mb={8}>
        <InputPanel>
          <Container>
            <x.div display="flex" alignItems="center" justifyContent="space-between">
              <x.div>
                <NumericalInput id="currencyB" disabled={false} value={secondValue} onChange={onChangeValues} />
              </x.div>

              <CurrencySelector disabled={false} selected={false} currency={currencies[1]} />
            </x.div>
            <x.div mt={2} textAlign="right">
              <x.p>Balance: {formatUnits(balanceB ?? 0n, 18)}</x.p>
            </x.div>
          </Container>
        </InputPanel>
      </SwapSection>

      <x.div mb={8}>
        <x.p>Prices</x.p>

        <x.div>
          <x.div>
            <x.p>1 {currencies[0].symbol} = {pair.priceCurrencyA} {currencies[1].symbol}</x.p>
            <x.p>1 {currencies[1].symbol} = {pair.priceCurrencyB} {currencies[0].symbol}</x.p>
          </x.div>
          <x.div></x.div>
        </x.div>
      </x.div>

      <x.div display="flex" mb={4}>
        <PrimaryButton
          disabled={isAllowCurrencyADisabled}
          onClick={() => approveA.write()}
          mr={4}
        >Approve {currencies[0].symbol}</PrimaryButton>
        <PrimaryButton
          disabled={isAllowCurrencyBDisabled}
          onClick={() => approveB.write()}
          ml={4}
        >Approve {currencies[1].symbol}</PrimaryButton>
      </x.div>

      <PrimaryButton disabled={isSupplyDisabled} onClick={() => addLiquidity.write()}>Supply</PrimaryButton>
    </x.div>
  );
}
