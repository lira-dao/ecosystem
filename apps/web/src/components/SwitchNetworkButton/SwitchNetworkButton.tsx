import { useSwitchChain } from 'wagmi';
import { Col } from '@lira-dao/ui';
import { Typography } from '../ui';
import { StyledButton } from '../ui/StyledButton';


export function SwitchNetworkButton() {
  const { chains, switchChain } = useSwitchChain();

  const onSwitchClick = () => {
    const chainId = Number(process.env.REACT_APP_CHAIN_ID);

    if (chainId) {
      console.log('id', chainId, chains[0].id);
      switchChain({ chainId });
    }
  };

  return (
    <Col alignItems="center" textAlign="center">
      <Typography mt={80} mb={80}>Please switch to the <b>Arbitrum One</b> network to participate in the Presale and
        access LIRA DAO features.</Typography>
      <StyledButton onClick={onSwitchClick}>
        <Typography color="white" margin={0} flexGrow={1}>Change Network</Typography>
      </StyledButton>
    </Col>
  );
}
