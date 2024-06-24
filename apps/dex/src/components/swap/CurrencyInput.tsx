import { ChangeEvent } from 'react';
import { x } from '@xstyled/styled-components';
import { Currency } from '@lira-dao/web3-utils';
import { SwapSection } from './SwapSection';
import { InputPanel } from './InputPanel';
import { CurrencySelector } from '../CurrencySelector';
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
  onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
  onCurrencySelectClick: () => void;
  onSetPercentage: (value: string) => void;
  selected: boolean;
  showPercentages?: boolean;
  title: string;
  value: string;
}

export function CurrencyInput({
  balance,
  currency,
  disabled,
  formattedBalance,
  id,
  insufficientBalance,
  onChangeValue,
  onCurrencySelectClick,
  onSetPercentage,
  selected = false,
  showPercentages = false,
  title,
  value,
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

  return (
    <SwapSection mt={6} mb={4}>
      <InputPanel>
        <Container>
          <x.div h="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="space-between">
            <x.div w="100%" display="flex" alignItems="center" justifyContent="space-between">
              <x.p color="gray155" userSelect="none">{title}</x.p>
              <CurrencySelector
                disabled={disabled}
                selected={selected}
                currency={currency}
                onClick={onCurrencySelectClick}
              />
            </x.div>

            <x.div w="100%" h="54px" display="flex" flexDirection="column">
              <NumericalInput id={id} disabled={!currency} value={value} onChange={onChangeValue} />
              <x.p color="red-400">{insufficientBalance ? 'Insufficient Balance' : ''}</x.p>
            </x.div>

            <x.div w="100%" display="flex" justifyContent={showPercentages ? 'space-between' : 'flex-end'}>
              {showPercentages && (
                <x.div display="flex">
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
