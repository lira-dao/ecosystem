import React from 'react';
import { Box, Grid, Typography, Container } from '@mui/material';
import ColorWrap from '../../../components/ui/ColorWrap';
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

export const LiraInfo: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ 
      alignItems: 'center',
      marginTop: '60px',
      // padding: ['80px 40px 120px', '40px 40px 120px', '60px 40px 120px', '80px auto 120px'],
      // alignItems: ['center', 'center', 'center', 'center']
    }}>
      <Grid container spacing={4} sx={{ mb: '120px', alignItems: 'center', justifyContent: 'center', paddingX: 2 }} >
        <Image img={gradientLiraChain} alt="Lira Chain" />
        <Content
          title={<Typography variant="h6" sx={{ fontWeight: 'bold', padding: "0 0 30px" }}>Why <ColorWrap>Choose</ColorWrap> LIRA DEX?</Typography>}
          text="LIRA DEX stands out in the crowded field of decentralized exchanges by offering a unique and sustainable
            approach to liquidity mining and reward distribution. Unlike traditional DEXs that calculate rewards based
            on fiat values, LIRA DEX uses the quantity of LDT tokens to determine rewards, ensuring stability and predictability.
            Our innovative reward system prevents hyperinflation and hyperdeflation, fostering a healthier market environment. 
            Additionally, with a significant portion of fees redistributed directly to liquidity providers and a commitment to 
            sustainable growth, LIRA DEX provides a secure, transparent, and rewarding platform for all participants. 
            Choose LIRA DEX for a more stable and reliable trading experience."
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
          title={<Typography variant="h6" sx={{ fontWeight: 'bold', padding: "0 0 30px" }} gutterBottom>Become an <ColorWrap>Ambassador</ColorWrap></Typography>}
          text="Join the LIRA DAO Ambassador Program and help expand our vibrant community. As an ambassador, you'll earn rewards
            through a multi-tiered referral system and contribute to the growth of the LIRA ecosystem. Maintain an active TB
            token staking position for six months to qualify and start benefiting from our comprehensive incentive structure.
            Learn more on our whitepaper about how you can get involved and make a difference with LIRA DAO."
        />
      </Grid>
    </Container>
  );
};
