import { x, th } from '@xstyled/styled-components';
import { NavLink, To } from 'react-router-dom';
import logo from '../img/logo-dex.png';
import styled from 'styled-components';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { ConnectButton } from './ConnectButton';
import { useAccount } from 'wagmi';


const StyledMenuItem = styled(NavLink)`
  color: ${th.color('white-a80')};
  cursor: pointer;
  font-size: ${th.fontSize('xl')};
  font-weight: 500;

  ::selection {
    color: inherit;
    background: transparent;
    text-shadow: none;
  }

  ::-moz-selection {
    color: inherit;
    background: transparent;
    text-shadow: none;
  }

  &:hover {
    color: ${th.color('white')};
  }

  &.active {
    color: ${th.color('primary')}!important;
  }

  &:visited {
    color: ${th.color('white-a80')};
  }
`;

interface MenuItemProps {
  text: string;
  to: To;
}

function MenuItem({ text, to }: MenuItemProps) {
  return (
    <x.div m={4}>
      <StyledMenuItem to={to}>{text}</StyledMenuItem>
    </x.div>
  );
}

export function Header() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <x.header
      w="100%"
      px={4}
      pt={4}
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      alignItems="center"
      mb={{ _: 8, lg: 0 }}
    >
      <NavLink to="/">
        <img src={logo} alt="lira dao logo" />
      </NavLink>

      <x.div ml={{ _: 0, lg: 8 }} display="flex" flexGrow={1}>
        {/*<MenuItem text="TREASURY" to="treasury" />*/}
        {/*<MenuItem text="LIQUIDITY" to="liquidity" />*/}
        {/*<MenuItem text="FARMS" to="farms" />*/}
        {/*<MenuItem text="STACKING" to="stacking" />*/}
        <MenuItem text="SWAP" to="swap" />
        <MenuItem text="POOL" to="pool" />
        <MenuItem text="FAUCETS" to="faucets" />
      </x.div>

      <x.div display="flex">
        {isConnected ? (
          <>
            <w3m-account-button balance="hide" />
          </>
        ) : (
          <ConnectButton onClick={() => open()} />
        )}
      </x.div>
    </x.header>
  );
}
