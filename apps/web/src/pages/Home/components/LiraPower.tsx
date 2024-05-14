import React from 'react';
import { Col } from '@lira-dao/ui';
import { StyledText } from './StyledText';
import { ColorWrap, Typography } from '../../../components/ui';
import liraHands from '../../../img/lira-hands.png';


export function LiraPower() {
  return (
    <Col
      background={`url(${liraHands}) no-repeat center top`}
      backgroundSize="contain"
    >
      <Col
        maxWidth={1024}
        margin="0 auto"
      >
        <Col margin={['210px 40px 0', '210px 40px 0', '420px 40px 0', '420px 4% 0']}>
          <StyledText as="h2" fontSize={['2xl', '5xl', '7xl', '8xl']} mt={0}>
            Unleashing the Power <br />of <ColorWrap color="primary">Decentralization</ColorWrap>
          </StyledText>

          <Typography>
            At LIRA, we are committed to revolutionizing decentralized finance and governance through cutting-edge
            blockchain technology and community-driven innovation. With this robust ecosystem of products and
            services,
            we
            empower individuals worldwide to access the benefits of decentralized finance securely and efficiently.
          </Typography>

          <Typography>
            Join us in shaping the future of finance and governance, where transparency, inclusivity, and
            decentralization
            are at the forefront. Together, let's build a more equitable and decentralized world with LIRA.
          </Typography>

          {/*<NavLink to="/presale">
          <img src={button} height={64} alt="Buy LDT" style={{ opacity: 0.3 }} />
        </NavLink>*/}
        </Col>
      </Col>
    </Col>
  );
}
