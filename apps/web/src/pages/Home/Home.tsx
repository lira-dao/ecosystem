import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Col, Row } from '@lira-dao/ui';
import { StyledContainer } from './components/StyledContainer';
import { StyledText } from './components/StyledText';
import { ColorWrap, Typography } from '../../components/ui';
import theme from '../../theme';
import { PresaleInfo } from './components/PresaleInfo';
import { LiraInfo } from './components/LiraInfo';
import { LiraPower } from './components/LiraPower';
import { StyledDivider } from './components/StyledDivider';
import button from '../../img/enter-app.svg';


export function Home() {
  return (
    <ThemeProvider theme={theme}>
      <StyledContainer backgroundPosition={['40% -250px', '40% -250px', '30% -250px', 'right -250px']}>
        <Col maxWidth={2048} margin={['0 80px']} alignItems={['center', 'center', 'center', 'flex-start']}>
          <StyledText
            as="h2"
            fontSize={['3xl', '5xl', '7xl', '8xl']}
            textAlign={['center', 'center', 'center', 'left']}
          >
            CRYPTOCURRENCY <br />GLOBAL <ColorWrap color="primary">REVOLUTION</ColorWrap>
          </StyledText>
        </Col>

        <Col
          width={[1, 1, 1, 3 / 6]}
          margin={[0, 0, 0, '0 80px']}
          justifyContent="space-between"
          alignItems="center"
        >
          <StyledText as="h2" fontSize={['32px', '46px', '80px', '80px']} marginBottom={40} textAlign="center">
            Join the LIRA <ColorWrap color="primary">DEX</ColorWrap>
          </StyledText>

          <a href="https://dex.liradao.org" target="_blank" rel="noreferrer">
            <img src={button} width={300} alt="go to lira dex button" />
          </a>
        </Col>

        <Col
          maxWidth={1024}
          margin={['80px 40px 120px', '40px 40px 120px', '60px 40px 120px', '80px auto 120px']}
          alignItems={['center', 'center', 'center', 'center']}
        >
          <Row>
            <StyledText as="h3" fontSize={['32px', '46px', '46px', '80px']} mb={40}>
              <ColorWrap color="primary">"</ColorWrap><br />Join the <ColorWrap color="primary">revolution</ColorWrap>
            </StyledText>
          </Row>
          <Col width={[1, 1, 1, '92%']}>
            <Typography color="white" fontSize="3xl" marginY={32}>
              Join us on the forefront of decentralized finance and governance with the LIRA DAO TOKEN (LDT) presale on
              the Arbitrum network. Seize this exclusive opportunity to become an early participant in the foundational
              phase of the LIRA ecosystem. With bonus incentives, secure token acquisition, and a vibrant community
              ecosystem, now is the time to embark on your journey towards a decentralized future.
            </Typography>
            <Typography color="white" fontSize="3xl" marginY={0}>
              Don't miss out, secure your LDT tokens today and be part of shaping the next generation of decentralized
              innovation.
            </Typography>
          </Col>
        </Col>

        {/*<PresaleInfo />*/}

        <LiraInfo />

        <LiraPower />

        <Row width={160}>
          <StyledDivider width={160} height={4} margin="80px 0 160px 0" />
        </Row>

        {/*<LiraRoadmap />*/}
      </StyledContainer>
    </ThemeProvider>
  );
}
