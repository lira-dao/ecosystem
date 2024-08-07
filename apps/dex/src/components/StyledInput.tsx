import { x } from '@xstyled/styled-components';
import { ChangeEvent } from 'react';


interface NumericalInputProps {
  disabled: boolean;
  value: number | string | undefined;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
  id: string
}

export function NumericalInput({ disabled, id, onChange, readOnly = false, value }: NumericalInputProps) {

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (e.target.value.includes(',')) {
      e.target.value = e.target.value.replace(',', '.');
    }

    if (e.target.value === '.') {
      e.target.value = '0.';
    }

    if (typeof onChange === 'function' && regex.test(e.target.value)) {
      onChange(e);
    }
  };

  return (
    <x.div w="100%" display="flex">
      <x.input
        autoComplete="off"
        autoCorrect="off"
        backgroundColor="transparent"
        border="none"
        color={{ _: 'white', placeholder: 'gray94', disabled: 'gray155' }}
        disabled={disabled}
        flex="1 1 auto"
        fontSize={28}
        id={id}
        inputMode="decimal"
        maxLength={79}
        minLength={1}
        onChange={onChangeInput}
        outline="none"
        overflow="hidden"
        padding={0}
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={0}
        pointerEvents={disabled ? 'none' : 'auto'}
        position="relative"
        readOnly={readOnly}
        spellCheck="false"
        textAlign="left"
        textOverflow="ellipsis"
        type="text"
        value={value}
        whiteSpace="nowrap"
      />
    </x.div>
  );
}
