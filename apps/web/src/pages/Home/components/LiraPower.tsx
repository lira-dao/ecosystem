import React from 'react';
import { Box, Container, Typography, ThemeProvider } from '@mui/material';
import muiTheme from '../../../theme_mui';
import liraHands from '../../../img/lira-hands.png';
import ColorWrap from '../../../components/ui/ColorWrap';

export const NewLiraPower: React.FC = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <Box
        sx={{
          backgroundImage: `url(${liraHands})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center top',
          backgroundSize: 'contain',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mt: { xs: '210px', md: '420px', lg: '420px' }, px: { xs: 2, lg: 4 }, pb: 4 }}>  {/* , mb: 4 */}
            <Typography sx={{
              typography: { xs: '2xl', sm: '5xl', md: '7xl', lg: '8xl' },
              textAlign: { xs: 'left', sm: 'left', md: 'left', lg: 'left' },
              fontFamily: "Avenir Next",
              fontWeight: 'bold',
              lineHeight: { xs: '1.8rem', sm: '3.35rem', md: '5.5rem', lg: '6rem' },
              marginBottom: ['0px', '75px'],
            }}>
              Unleashing the Power <br />of <ColorWrap>Decentralization</ColorWrap>
            </Typography>

            <Typography sx={{ 
              marginY: 5, 
              fontSize: '18px',
              lineHeight: '26px'
            }}>
              At LIRA, we are committed to revolutionizing decentralized finance and governance through cutting-edge
              blockchain technology and community-driven innovation. With this robust ecosystem of products and
              services,
              we
              empower individuals worldwide to access the benefits of decentralized finance securely and efficiently.
            </Typography>

            <Typography  sx={{ 
              marginY: 5,
              fontSize: '18px',
              lineHeight: '26px'
            }}>
              Join us in shaping the future of finance and governance, where transparency, inclusivity, and
              decentralization
              are at the forefront. Together, let's build a more equitable and decentralized world with LIRA.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};
