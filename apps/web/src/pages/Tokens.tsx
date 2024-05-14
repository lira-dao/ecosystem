import styled, { ThemeProvider } from 'styled-components';
import { addLiraDaoToken, addLiraToken } from '../utils/addLiraToken';
import logoArbitrum from '../img/arbitrum-shield.png';
import logoMetamask from '../img/metamask-fox.svg';
import { Typography } from '../components/ui';
import { Col, Row } from '@satoshi-lira/ui';
import theme from '../theme';

const StyledLogo = styled.img`
  margin: 0 8px;
  cursor: pointer;
`;

const StyledCopyButton = styled(Typography)`
  color: ${props => props.theme.colors['white-80']};
  cursor: pointer;

  &:active {
    color: ${props => props.theme.colors.primary};
  }

  &::selection {
    color: inherit;
    background: inherit;
  }
`;

export function Tokens() {
  const copyLira = () => navigator.clipboard.writeText('0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3');
  const copyLdt = () => navigator.clipboard.writeText('0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f');

  return (
    <ThemeProvider theme={theme}>
      <Col alignItems="center" minHeight="46vh">
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography as="h5" color="white" margin="0 8px">Satoshi LIRA</Typography>
          <a
            href="https://arbiscan.io/address/0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3" target="_blank"
            rel="noreferrer"
          >
            <StyledLogo
              src={logoArbitrum}
              alt="link to satoshi lira contract on arbiscan"
              width={50}
              height={50}
            />
          </a>
          <StyledLogo
            src={logoMetamask}
            alt="add to metamask"
            width={40}
            onClick={addLiraToken}
          />
        </Row>
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography
            fontSize="body"
            color="white"
            wordBreak="break-all"
            marginX={[20, 20, 20, 0]}
            textAlign="center"
          >0xA07ac236fEBc390c798504E927DC8D6a4e1FfcA3</Typography>
          <StyledCopyButton onClick={copyLira} marginLeft={3}>
            Copy
          </StyledCopyButton>
        </Row>

        <Col my={40} />

        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography as="h5" color="white" margin="0 8px">LIRA DAO Token</Typography>
          <a
            href="https://arbiscan.io/address/0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f" target="_blank"
            rel="noreferrer"
          >
            <StyledLogo
              src={logoArbitrum}
              alt="link to lira dao token contract on arbiscan"
              width={50}
              height={50}
            />
          </a>
          <StyledLogo
            src={logoMetamask}
            alt="add to metamask"
            width={40}
            onClick={addLiraDaoToken}
          />
        </Row>
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography
            fontSize="body"
            color="white"
            wordBreak="break-all"
            marginX={[20, 20, 20, 0]}
            textAlign="center"
          >0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f</Typography>
          <StyledCopyButton onClick={copyLdt} marginLeft={3}>
            Copy
          </StyledCopyButton>
        </Row>
      </Col>
    </ThemeProvider>
  );
}
