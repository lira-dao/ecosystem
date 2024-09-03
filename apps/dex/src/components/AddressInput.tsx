import { Box, InputBase } from '@mui/material';
import { EthereumAddress } from '@lira-dao/web3-utils';

interface AddressInputProps {
  disabled?: boolean;
  readOnly?: boolean;
  value?: EthereumAddress;
}

export function AddressInput({ disabled, value, readOnly = false }: AddressInputProps) {
  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <InputBase
        value={value}
        placeholder="0"
        sx={{
          flex: '1 1 auto',
          width: 0,
          position: 'relative',
          outline: 'none',
          border: 'none',
          color: (theme) => theme.palette.text.primary,
          pointerEvents: disabled ? 'none' : 'auto',
          backgroundColor: 'transparent',
          fontSize: 26,
          textAlign: 'left',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          padding: 0,
          '&::placeholder': {
            color: (theme) => theme.palette.text.secondary,
          },
        }}
        readOnly={readOnly}
      />
    </Box>
  );
}
