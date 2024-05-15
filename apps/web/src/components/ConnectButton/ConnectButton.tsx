import styled from 'styled-components';
import metamask from '../../img/metamask-fox.svg';
import { Col } from '@lira-dao/ui';
import { Typography } from '../ui';
import { useAccount, useDisconnect } from 'wagmi';
import { useWeb3Modal } from '@web3modal/wagmi/react';


const StyledButton = styled.button`
  display: flex;
  max-width: 280px;
  align-items: center;
  background-color: transparent;
  padding: 8px 10px;
  border: 1px ${props => props.theme.colors.primary} solid;
  border-radius: 50px;
  cursor: pointer;

  & > img {
    margin-right: 8px;
  }

  &:active {
    border: 1px ${props => props.theme.colors.secondary} solid;
  }
`;

export function ConnectButton() {
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal()
  const { disconnect } = useDisconnect();

  return (
    <Col alignItems="center">
      <StyledButton onClick={() => isConnected ? disconnect() : open()}>
        <img src={metamask} width={30} alt="metamask icon" />
        <Typography color="white" margin={0} flexGrow={1}>{isConnected ? 'Disconnect' : 'Connect'} Metamask</Typography>
      </StyledButton>
    </Col>
  );
}
