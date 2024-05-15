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
  return (
    <x.div display="flex" flexGrow={1}>
      <x.input
        backgroundColor="transparent"
        border="none"
        color={{ _: 'white', placeholder: 'gray94' }}
        flex="1 1 auto"
        fontSize={28}
        id={id}
        onChange={onChange}
        outline="none"
        overflow="hidden"
        padding={0}
        pattern="^[0-9]*[.,]?[0-9]*$"
        placeholder={0}
        pointerEvents={disabled ? 'none' : 'auto'}
        position="relative"
        readOnly={readOnly}
        textAlign="left"
        textOverflow="ellipsis"
        value={value}
        whiteSpace="nowrap"
      />
    </x.div>
  );
}
