import React from 'react';
import { Col, Row } from '@satoshi-lira/ui';
import { ColorWrap, Typography } from '../../../components/ui';
import gradientLiraChain from '../../../img/gradient-lira-chain.svg';
import gradientLiraDao from '../../../img/gradient-lira-dao.svg';
import gradientIntrinsicValue from '../../../img/gradient-intrinsic-value.svg';
import gradientLiraDex from '../../../img/gradient-lira-dex.svg';


function Image({ img }: { img: string }) {
  return (
    <Col
      alignItems="center"
      justifyContent="center"
      marginBottom={[40, 40, 40, 0]}
      marginX="auto"
      width={[1, 1 / 2, 1 / 2, 1 / 4]}
    >
      <img src={img} width="100%" alt="lira chain" />
    </Col>
  );
}

function Content({ title, text }: { title: React.ReactNode, text: string }) {
  return (
    <Col width={[1, 1, 1, 1 / 2]}>
      {title}

      <Typography fontSize="xl" textAlign="justify" margin={0}>
        {text}
      </Typography>
    </Col>
  );
}

const maxWidth = 1280;
const containerMargin = ['0 40px', '0 40px', '0 40px', '0 4%'];
const contentMarginBottom = [120, 120, 120, 120];


export function LiraInfo() {
  return (
    <Col maxWidth={maxWidth} margin="0 auto">
      <Col margin={containerMargin}>
        <Row flexDirection={['column', 'column', 'column', 'row']} marginBottom={contentMarginBottom}>
          <Image img={gradientLiraChain} />

          <Content
            title={
              <Typography as="h6" margin="0 0 30px">
                Why <ColorWrap color="primary">Choose</ColorWrap> LIRA CHAIN?
              </Typography>
            }
            text="LIRA CHAIN is a cutting-edge Layer 1 blockchain solution designed to revolutionize decentralized
              finance (DeFi) and governance. Built with scalability, security, and decentralization at its core, LIRA CHAIN
              offers a robust infrastructure for executing smart contracts, deploying decentralized applications
              (DApps), and facilitating secure and efficient transactions. Powered by the native cryptocurrency LIRA DAO
              COIN (LDC), LIRA CHAIN enables users to participate in governance processes, stake their tokens, and
              engage in decentralized decision-making within the ecosystem. With its innovative features and
              community-driven ethos, LIRA CHAIN paves the way for a decentralized future, empowering individuals to
              take control of their financial destinies and shape the evolution of decentralized ecosystems. Join us
              on the journey towards a new era of decentralized innovation with LIRA CHAIN."
          />
        </Row>

        <Row
          flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
          marginBottom={contentMarginBottom}
        >
          <Content
            title={
              <Typography as="h6" margin="0 0 30px">
                LIRA DAO <ColorWrap color="primary">Ecosystem</ColorWrap>
              </Typography>
            }
            text="LIRA DAO is the decentralized autonomous organization (DAO) driving the governance and development of the
              LIRA ecosystem. Governed by its community of token holders, LIRA DAO empowers participants to collectively
              make decisions regarding protocol upgrades, ecosystem enhancements, and resource allocation. Through
              transparent and decentralized governance processes, LIRA DAO ensures that the interests of the community
              are prioritized, fostering inclusivity, fairness, and innovation within the ecosystem. With LIRA DAO at
              its helm, the LIRA ecosystem is poised to evolve dynamically, guided by the principles of decentralization
              and community-driven governance. Join us in shaping the future of decentralized finance and governance
              with LIRA DAO."
          />

          <Image img={gradientLiraDao} />
        </Row>
      </Col>

      <Col maxWidth={maxWidth} margin={containerMargin}>
        <Row flexDirection={['column', 'column', 'column', 'row']} marginBottom={contentMarginBottom}>
          <Image img={gradientIntrinsicValue} />

          <Content
            title={
              <Typography as="h6" margin="0 0 30px">
                The <ColorWrap color="primary">Power</ColorWrap> of Intrinsic BTC Value
              </Typography>
            }
            text="Satoshi LIRA Token is a groundbreaking digital asset native to the LIRA blockchain, uniquely designed to
              encapsulate the principles of sound money and financial sovereignty. With a fixed supply and intrinsic
              value linked to Bitcoin, Satoshi LIRA Token represents a secure store of value within the LIRA ecosystem.
              Rooted in the ethos of decentralization and innovation, Satoshi LIRA Token offers users an opportunity to
              participate in a decentralized financial ecosystem built on the foundations of transparency, security, and
              inclusivity. Join us in harnessing the power of Satoshi LIRA Token to unlock new possibilities in
              decentralized finance and reshape the future of digital economies."
          />
        </Row>

        <Row
          flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
          marginBottom={contentMarginBottom}
        >
          <Content
            title={
              <Typography as="h6" margin="0 0 30px">
                LIRA <ColorWrap color="primary">DEX</ColorWrap>
              </Typography>
            }
            text="LIRA DEX is the decentralized exchange (DEX) built on the LIRA blockchain, providing users with a secure
              and efficient platform for trading digital assets. Powered by cutting-edge technology and designed with
              user experience in mind, LIRA DEX offers seamless access to a wide range of cryptocurrencies, facilitating
              peer-to-peer transactions with minimal fees and maximum security. With its decentralized architecture
              and non-custodial nature, LIRA DEX empowers users to retain control over their assets while participating in
              a vibrant and liquid marketplace. Join us on LIRA DEX and experience the future of decentralized trading firsthand."
          />

          <Image img={gradientLiraDex} />
        </Row>
      </Col>
    </Col>
  );
}
