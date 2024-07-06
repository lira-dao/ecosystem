import { ChangeEvent } from 'react';
import { x } from '@xstyled/styled-components';
import { Currency } from '@lira-dao/web3-utils';
import { SwapSection } from './SwapSection';
import { InputPanel } from './InputPanel';
import { CurrencySelector } from '../CurrencySelector';
import { Price } from '../../hooks/usePrices';
import { NumericalInput } from '../StyledInput';
import { Container } from './Container';
import BigNumber from 'bignumber.js';


interface CurrencyInputProps {
  balance: bigint;
  currency?: Currency;
  disabled: boolean;
  formattedBalance: string;
  id: string;
  insufficientBalance: boolean;
  isDisabledCurrencySelector?: boolean;
  onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
  onCurrencySelectClick: () => void;
  onSetPercentage: (value: string) => void;
  selected: boolean;
  showPercentages?: boolean;
  title: string;
  value: string;
  price?: string;
  priceETH?: number | null;  // price ETH in USD
}

export function CurrencyInput({
  balance,
  currency,
  disabled = false,
  formattedBalance,
  id,
  insufficientBalance,
  isDisabledCurrencySelector = false,
  onChangeValue,
  onCurrencySelectClick,
  onSetPercentage,
  selected = false,
  showPercentages = false,
  title,
  value,
  price,
  priceETH
}: CurrencyInputProps) {
  const onSetPercentageInternal = (percentage: number) => {
    if (percentage === 100) {
      onSetPercentage(new BigNumber(balance.toString()).div(new BigNumber(10).pow(currency?.decimals || 18)).toString());
    } else {
      onSetPercentage(
        new BigNumber((new BigNumber(balance.toString()).times(percentage)).div(100)).div(new BigNumber(10).pow(currency?.decimals || 18)).toString(),
      );
    }
  };
  console.log('disabled', disabled);
  console.log('prices', price)

  const isValidNumber = (val: string) => {
    const number = parseFloat(val);
    return !isNaN(number) && number > 0;
  };

  const usdEquivalent = isValidNumber(value) && price ? `$${(parseFloat(value) * parseFloat(price)).toFixed(2)} USD` : '';

  const currencyPrice = (): string => {
    return (price && value !== '' && isValidNumber(value)) ? (currency?.symbol === 'LDT' && priceETH ? `~$${(parseFloat(value) * parseFloat(price) * priceETH).toFixed(2)}` : `~$${(parseFloat(value) * parseFloat(price)).toFixed(2)}`) : ''
  }

  return (
    <SwapSection mt={6} mb={4}>
      <InputPanel>
        <Container>
          <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
            <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
              <x.p color="gray155" userSelect="none">{title}</x.p>
              <CurrencySelector
                disabled={isDisabledCurrencySelector}
                selected={selected}
                currency={currency}
                onClick={onCurrencySelectClick}
              />
            </x.div>

            <x.div w="100%" h="54px" display="flex" flexDirection="column">
              <NumericalInput id={id} disabled={!currency || disabled} value={value} onChange={onChangeValue} />
              {insufficientBalance && (
                <x.div w="100%" display="flex" justifyContent={insufficientBalance ? 'space-between' : 'flex-end'}>
                  <x.p color="red-400">Insufficient Balance</x.p>
                  <x.p color="red-400">{currencyPrice()}</x.p>
                </x.div>
              )}
              {!insufficientBalance && (
                <x.div w="100%" display="flex" justifyContent='flex-end'>
                  <x.p color="gray155">{currencyPrice()}</x.p>
                </x.div>
              )}
            </x.div>

            <x.div w="100%" display="flex" justifyContent={showPercentages ? 'space-between' : 'flex-end'}>
              {showPercentages && (
                <x.div display="flex">
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentageInternal(10)}
                  >10%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentageInternal(25)}
                  >25%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentageInternal(50)}
                  >50%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentageInternal(75)}
                  >75%
                  </x.p>
                  <x.p
                    mr={2}
                    cursor="pointer"
                    color={{ _: 'gray155', hover: 'white' }}
                    onClick={() => onSetPercentageInternal(100)}
                  >100%
                  </x.p>
                </x.div>
              )}
              <x.div>
                <x.p color="gray155">{formattedBalance}</x.p>
              </x.div>
            </x.div>
          </x.div>
        </Container>
      </InputPanel>
    </SwapSection>
  );
}