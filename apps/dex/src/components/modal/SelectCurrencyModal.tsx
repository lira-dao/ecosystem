import React from 'react';
import Modal from 'react-responsive-modal';
import { x } from '@xstyled/styled-components';
import { Currency } from '@lira-dao/web3-utils';


export interface SelectCurrencyModalProps {
  open: boolean;
  onClose: () => void;
  styles?: {
    root?: React.CSSProperties;
    overlay?: React.CSSProperties;
    modalContainer?: React.CSSProperties;
    modal?: React.CSSProperties;
    closeButton?: React.CSSProperties;
    closeIcon?: React.CSSProperties;
  };
  currencies: Currency[];
  onSelect: (currency: Currency) => void;
}

const modalCustomStyles = {
  modal: {
    top: '20%',
    backgroundColor: '#1B1B1B',
    borderRadius: 16,
    maxWidth: 420,
    minWidth: 420,
  },
  closeIcon: {
    fill: 'white',
  },
};

export function SelectCurrencyModal({
  open,
  onClose,
  styles = modalCustomStyles,
  currencies,
  onSelect,
}: SelectCurrencyModalProps) {
  return (
    <Modal open={open} onClose={onClose} styles={styles}>
      <x.h1 fontSize="xl">Select Token</x.h1>
      <x.div mt={8}>
        {currencies.map((currency, i) => (
          <x.div
            key={i}
            display="flex"
            alignItems="center"
            my={4}
            cursor="pointer"
            onClick={() => onSelect(currency)}
          >
            <x.div>
              <x.img src={currency.icon} width={48} height={48} />
            </x.div>
            <x.div ml={4}>
              <x.h1>{currency.symbol}</x.h1>
            </x.div>
          </x.div>
        ))}
      </x.div>
    </Modal>
  );
}