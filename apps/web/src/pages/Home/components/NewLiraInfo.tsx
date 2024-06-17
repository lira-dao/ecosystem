import React from 'react';
import { Box, Grid, Typography, Container, ThemeProvider } from '@mui/material';
import muiTheme from '../../../theme_mui';
import ColorWrap from '../../../components/ui/NewColorWrap';
import gradientLiraChain from '../../../img/gradient-lira-chain.svg';
import gradientLiraDao from '../../../img/gradient-lira-dao.svg';
import gradientIntrinsicValue from '../../../img/gradient-intrinsic-value.svg';
import gradientLiraDex from '../../../img/gradient-lira-dex.svg';


const Image = ({ img, alt }: { img: string; alt: string }) => (
  <Grid xs={10} sm={9} md={7} lg={6} xl={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <img src={img} alt={alt} style={{ width: '100%', maxWidth: '80%' }} />
  </Grid>
);

const Content = ({ title, text }: { title: React.ReactNode; text: string }) => (
  <Grid item xs={12} md={12} lg={6} xl={6}>
    {title}
    <Box sx={{ lineHeight: '1.6rem', textAlign: 'justify', width: [1, 1, 1, '92%'] }}>
      <Typography variant="xl" >
        {text}
      </Typography>
    </Box>
  </Grid>
);

export const NewLiraInfo: React.FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Container maxWidth="xl" sx={{ 
        alignItems: 'center',
        marginTop: '60px',
        // padding: ['80px 40px 120px', '40px 40px 120px', '60px 40px 120px', '80px auto 120px'],
        // alignItems: ['center', 'center', 'center', 'center']
      }}>
        <Grid container spacing={4} sx={{ mb: '120px', alignItems: 'center', justifyContent: 'center', paddingX: 2 }} >
          <Image img={gradientLiraChain} alt="Lira Chain" />
          <Content
            title={<Typography variant="h6" sx={{ fontWeight: 'bold', padding: "0 0 30px" }}>Why <ColorWrap>Choose</ColorWrap> LIRA CHAIN?</Typography>}
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
        </Grid>
        <Grid container spacing={4} sx={{ mb: '120px', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse' }}>
          <Image img={gradientLiraDao} alt="Lira Dao" />
          <Content
            title={<Typography variant="h6" sx={{ fontWeight: 'bold', padding: "0 0 30px" }}>LIRA DAO <ColorWrap>Ecosystem</ColorWrap></Typography>}
            text="LIRA DAO is the decentralized autonomous organization (DAO) driving the governance and development of the
              LIRA ecosystem. Governed by its community of token holders, LIRA DAO empowers participants to collectively
              make decisions regarding protocol upgrades, ecosystem enhancements, and resource allocation. Through
              transparent and decentralized governance processes, LIRA DAO ensures that the interests of the community
              are prioritized, fostering inclusivity, fairness, and innovation within the ecosystem. With LIRA DAO at
              its helm, the LIRA ecosystem is poised to evolve dynamically, guided by the principles of decentralization
              and community-driven governance. Join us in shaping the future of decentralized finance and governance
              with LIRA DAO."
          />
        </Grid>
        <Grid container spacing={4} sx={{ mb: '120px', alignItems: 'center', justifyContent: 'center' }}>
          <Image img={gradientIntrinsicValue} alt="Intrinsic BTC Value" />
          <Content
            title={<Typography variant="h6" sx={{ fontWeight: 'bold', padding: "0 0 30px" }} gutterBottom>The <ColorWrap>Power</ColorWrap> of Intrinsic BTC Value</Typography>}
            text="Satoshi LIRA Token is a groundbreaking digital asset native to the LIRA blockchain, uniquely designed to
              encapsulate the principles of sound money and financial sovereignty. With a fixed supply and intrinsic
              value linked to Bitcoin, Satoshi LIRA Token represents a secure store of value within the LIRA ecosystem.
              Rooted in the ethos of decentralization and innovation, Satoshi LIRA Token offers users an opportunity to
              participate in a decentralized financial ecosystem built on the foundations of transparency, security, and
              inclusivity. Join us in harnessing the power of Satoshi LIRA Token to unlock new possibilities in
              decentralized finance and reshape the future of digital economies."
          />
        </Grid>
        <Grid container spacing={4} sx={{ mb: '120px', alignItems: 'center', justifyContent: 'center', flexDirection: 'row-reverse' }}>
          <Image img={gradientLiraDex} alt="Lira DEX" />
          <Content
            title={<Typography variant="h6" sx={{ fontWeight: 'bold', padding: "0 0 30px" }} gutterBottom>LIRA <ColorWrap>DEX</ColorWrap></Typography>}
            text="LIRA DEX is the decentralized exchange (DEX) built on the LIRA blockchain, providing users with a secure
              and efficient platform for trading digital assets. Powered by cutting-edge technology and designed with
              user experience in mind, LIRA DEX offers seamless access to a wide range of cryptocurrencies, facilitating
              peer-to-peer transactions with minimal fees and maximum security. With its decentralized architecture
              and non-custodial nature, LIRA DEX empowers users to retain control over their assets while participating in
              a vibrant and liquid marketplace. Join us on LIRA DEX and experience the future of decentralized trading firsthand."
          />
        </Grid>
      </Container>
    </ThemeProvider>
  );
};
