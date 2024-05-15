import { x } from '@xstyled/styled-components';
import { CurrencyLogo } from './CurrencyLogo';
import { BaseButton } from './BaseButton';
import dropdown from '../img/dropdown.svg';
import { Currency } from '../types';
import { ChangeEvent } from 'react';


interface CurrencySelectorProps {
  disabled: boolean;
  selected: boolean;
  currency: Currency;
  onClick?: () => void;
}

export function CurrencySelector({ currency, disabled, selected, onClick }: CurrencySelectorProps) {
  return (
    <x.div display="flex" alignItems="center" justifyContent="space-between">
      <BaseButton
        h="36px"
        justifyContent="space-between"
        backgroundColor={{ _: 'surface1', hover: 'surface2', active: 'surface2' }}
        borderColor={selected ? 'green-yellow-800' : 'green-yellow-800'}
        fontSize="24px"
        gap="8px"
        opacity={disabled ? 0.4 : 1}
        outline={{ _: 'none', focus: 'none' }}
        userSelect="none"
        onClick={onClick}
      >
        <CurrencyLogo size={24} logo={currency.icon} />
        {currency.symbol}
        <x.img src={dropdown} margin="0 0.25rem 0 0.35rem" />
      </BaseButton>
    </x.div>
  );
}
