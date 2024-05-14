import { x } from '@xstyled/styled-components';
import blankToken from '../img/blank-token.svg';

interface CurrencyLogoProps {
  logo?: string;
  size: number;
}

export function CurrencyLogo({size, logo}: CurrencyLogoProps ) {
  return (
    <x.div display="flex">
      <x.img w={`${size}px`} h={`${size}px`} borderRadius="50%" src={logo ? logo : blankToken} />
    </x.div>
  );
}
