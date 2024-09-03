import { Box, InputBase } from '@mui/material';
import { ChangeEvent } from 'react';

interface NumericalInputProps {
  disabled: boolean;
  value: number | string | undefined;
  readOnly?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  id: string;
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
    <Box sx={{ width: '100%', display: 'flex' }}>
      <InputBase
        autoComplete="off"
        autoCorrect="off"
        sx={{
          backgroundColor: 'transparent',
          border: 'none',
          color: disabled ? 'orange' : 'white',
          flex: '1 1 auto',
          fontSize: 28,
          inputMode: 'decimal',
          maxLength: 79,
          minLength: 1,
          outline: 'none',
          overflow: 'hidden',
          padding: 0,
          pointerEvents: disabled ? 'none' : 'auto',
          position: 'relative',
          textAlign: 'left',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          '&::placeholder': {
            color: 'gray',
          },
        }}
        id={id}
        onChange={onChangeInput}
        disabled={disabled}
        readOnly={readOnly}
        spellCheck="false"
        type="text"
        value={value}
      />
    </Box>
  );
}
