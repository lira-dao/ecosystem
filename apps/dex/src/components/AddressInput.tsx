import { x } from '@xstyled/styled-components';
import { EthereumAddress } from '@lira-dao/web3-utils';

interface AddressInputProps {
  disabled?: boolean;
  readOnly?: boolean;
  value?: EthereumAddress;
}

export function AddressInput({ disabled, value, readOnly = false }: AddressInputProps) {
  return (
    <x.div display="flex" flexGrow={1}>
      <x.input
        value={value}
        placeholder={0}
        flex="1 1 auto"
        w="0px"
        position="relative"
        outline="none"
        border="none"
        color={{ _: 'white', placeholder: 'gray94' }}
        pointerEvents={disabled ? 'none' : 'auto'}
        backgroundColor="transparent"
        fontSize={28}
        textAlign="left"
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        padding={0}
        readOnly={readOnly}
      />
    </x.div>
  );
}
