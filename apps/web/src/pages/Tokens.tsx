import styled, { ThemeProvider } from 'styled-components';
import {
  addLiraDaoToken,
  addLiraToken,
  addTreasuryBondBronzeToken,
  addTreasuryBondGoldToken,
  addTreasuryBondSilverToken,
} from '../utils/addLiraToken';
import logoArbitrum from '../img/arbitrum-shield.png';
import logoMetamask from '../img/metamask-fox.svg';
import dexScreener from '../img/dex-screener.svg';
import { Typography } from '../components/ui';
import { Col, Row } from '@lira-dao/ui';
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
  const copyTbb = () => navigator.clipboard.writeText('0x9C0385b4F1f3B277ab352B817fC56763081a503c');
  const copyTbs = () => navigator.clipboard.writeText('0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1');
  const copyTbg = () => navigator.clipboard.writeText('0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5');

  return (
    <ThemeProvider theme={theme}>
      <Col alignItems="center" minHeight="46vh">
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography as="h5" color="white" margin="0 8px">Satoshi LIRA (LIRA)</Typography>
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
          <Typography as="h5" color="white" margin="0 8px">LIRA DAO Token (LDT)</Typography>
          <a
            href="https://arbiscan.io/address/0x2A5E22b32b3E0Daa7a8C199e10Df9D9E1264Fd3f"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={logoArbitrum}
              alt="link to lira dao token contract on arbiscan"
              width={50}
              height={50}
            />
          </a>
          <a
            href="https://dexscreener.com/arbitrum/0xc828f6c8bbf9a90db6db9839696ffbf6e06532f9"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={dexScreener}
              alt="link to ldt weth pair on dextools"
              width={50}
              height={50}
            />
          </a>
          <StyledLogo
            src={logoMetamask}
            alt="add to metamask"
            onClick={addLiraDaoToken}
            width={50}
            height={50}
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

        <Col my={40} />

        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography as="h5" color="white" margin="0 8px">Treasury Bond Bronze (TBb)</Typography>
          <a
            href="https://arbiscan.io/address/0x9C0385b4F1f3B277ab352B817fC56763081a503c"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={logoArbitrum}
              alt="link to treasury bond bronze token contract on arbiscan"
              width={50}
              height={50}
            />
          </a>
          <a
            href="https://dexscreener.com/arbitrum/0xAfb2aaA7b90905f32fDb3E61010F0dc2705827ca"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={dexScreener}
              alt="link to treasury bond bronze ldt pair on dextools"
              width={50}
              height={50}
            />
          </a>
          <StyledLogo
            src={logoMetamask}
            alt="add to metamask"
            onClick={addTreasuryBondBronzeToken}
            width={50}
            height={50}
          />
        </Row>
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography
            fontSize="body"
            color="white"
            wordBreak="break-all"
            marginX={[20, 20, 20, 0]}
            textAlign="center"
          >0x9C0385b4F1f3B277ab352B817fC56763081a503c</Typography>
          <StyledCopyButton onClick={copyTbb} marginLeft={3}>
            Copy
          </StyledCopyButton>
        </Row>

        <Col my={40} />

        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography as="h5" color="white" margin="0 8px">Treasury Bond Silver (TBs)</Typography>
          <a
            href="https://arbiscan.io/address/0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={logoArbitrum}
              alt="link to treasury bond silver token contract on arbiscan"
              width={50}
              height={50}
            />
          </a>
          <a
            href="https://dexscreener.com/arbitrum/0xaFFEBBcbd0DD5AEDeCCdAB84b4103828780fD972"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={dexScreener}
              alt="link to treasury bond silver ldt pair on dextools"
              width={50}
              height={50}
            />
          </a>
          <StyledLogo
            src={logoMetamask}
            alt="add to metamask"
            onClick={addTreasuryBondSilverToken}
            width={50}
            height={50}
          />
        </Row>
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography
            fontSize="body"
            color="white"
            wordBreak="break-all"
            marginX={[20, 20, 20, 0]}
            textAlign="center"
          >0x4bB0Eb07a8ECDcF5f434095Aa34Cc3f69292bcA1</Typography>
          <StyledCopyButton onClick={copyTbs} marginLeft={3}>
            Copy
          </StyledCopyButton>
        </Row>

        <Col my={40} />

        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography as="h5" color="white" margin="0 8px">Treasury Bond Gold (TBg)</Typography>
          <a
            href="https://arbiscan.io/address/0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={logoArbitrum}
              alt="link to treasury bond gold token contract on arbiscan"
              width={50}
              height={50}
            />
          </a>
          <a
            href="https://dexscreener.com/arbitrum/0xe24dB13D645218672D4D5Fc15f572328b32946A4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <StyledLogo
              src={dexScreener}
              alt="link to treasury bond gold ldt pair on dextools"
              width={50}
              height={50}
            />
          </a>
          <StyledLogo
            src={logoMetamask}
            alt="add to metamask"
            onClick={addTreasuryBondGoldToken}
            width={50}
            height={50}
          />
        </Row>
        <Row flexDirection={['column', 'column', 'column', 'row']} alignItems="center">
          <Typography
            fontSize="body"
            color="white"
            wordBreak="break-all"
            marginX={[20, 20, 20, 0]}
            textAlign="center"
          >0xDB0aEb568EfE3598e9A58407c8b52BcFaC2c11e5</Typography>
          <StyledCopyButton onClick={copyTbg} marginLeft={3}>
            Copy
          </StyledCopyButton>
        </Row>
      </Col>
    </ThemeProvider>
  );
}
