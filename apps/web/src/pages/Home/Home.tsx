import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { StyledContainer } from './components/StyledContainer';
import { LiraInfo } from './components/LiraInfo';
import { LiraPower } from './components/LiraPower';
import StyledDivider from './components/StyledDivider';
import ColorWrap from '../../components/ui/ColorWrap';
import button from '../../img/enter-app.png';


export function Home() {

  return (
    <StyledContainer backgroundPosition={['50% -250px', '40% -250px', '30% -250px', 'right -250px']}>
      <Container sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: ['center', 'center', 'base-line', 'flex-start'],
        padding: ['0 0 0 0', '0 0 0 0', '0 0 0 0', '0px 0px 0px 80px'],
        marginX: 0
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              marginX: 0,
              marginY: ['48px', '64px', '64px', '64px'],
              typography: { xs: '3xl', sm: '5xl', md: '7xl', lg: '8xl' },    
              textAlign: { xs: 'center', sm: 'center', md: 'center', lg: 'left' },
              fontFamily: 'Avenir Next',
              fontWeight: 'bold'
            }}
          >
            CRYPTOCURRENCY <br />GLOBAL <ColorWrap>REVOLUTION</ColorWrap>
          </Typography>
        </Box>
      </Container>

      <Container sx={{ 
        display: 'flex',
        flexDirection: 'column',
        margin: {
          xs: '0px',
          sm: '48px 0px',
          md: '24px 0px',
          lg: '0px 80px'
        },
        width: [1, 1, 1, 1 / 2 ]
      }}>
        <Box sx={{
          justifycontent: 'center',
          textAlign: 'center',
          mb: 4
        }}>
          <Typography 
            sx={{
              typography: { xs: '3xl', sm: '5xl', md: '8xl', lg: '8xl' },
              marginY: 4,
              fontFamily: 'Avenir Next',
              fontWeight: 'bold',
            }}>
            Join the LIRA <ColorWrap>DEX</ColorWrap>
          </Typography>
          <a href="https://dex.liradao.org" target="_blank" rel="noreferrer">
            <img src={button} width={300} alt="go to lira dex button" />
          </a>
        </Box>
      </Container>

      <Container sx={{ 
        maxWidth: 1024,
        padding: ['80px 40px 120px', '40px 40px 120px', '60px 80px 120px', '90px 100px 120px'],
        alignItems: ['center', 'center', 'center', 'center'],
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Box sx={{ mb: 4 }}>
          <Typography 
            sx={{
              typography: { xs: '3xl', sm: '4xl', md: '5xl', lg: '7xl' },
              fontFamily: 'Avenir Next',
              fontWeight: 'bold'
            }}>
              <Box sx={{ 
                textAlign: 'left', 
                flexDirection: 'row', 
                justifyContent: 'center', 
                lineHeight: { xs: '2.5rem', sm: '2.5rem' , md: '3.5rem' , lg: '5rem' },
                marginBottom: '24px'
              }}>
                <ColorWrap>"</ColorWrap><br /><span>Join the</span><ColorWrap> revolution</ColorWrap>
              </Box>
          </Typography>
        </Box>
        <Box sx={{ width: [1, 1, '98%', '92%'] }}>
          <Typography fontSize="3xl" marginY={3} lineHeight='2.3rem'>
            Join us on the forefront of decentralized finance and governance with the LIRA DAO TOKEN (LDT) on the
            Arbitrum network. Seize this exclusive opportunity to become an early participant in the foundational
            phase of the LIRA ecosystem. With bonus incentives, secure token acquisition, and a vibrant community
            ecosystem, now is the time to embark on your journey towards a decentralized future.
          </Typography>
          <Typography fontSize="3xl" marginY={3} lineHeight='2.3rem'>
            Don't miss out, secure your LDT tokens today and be part of shaping the next generation of decentralized
            innovation.
          </Typography>
        </Box>
      </Container>

      <LiraInfo />

      <LiraPower />

      <StyledDivider width={160} height={5} margin="40px 0 170px 0"></StyledDivider>
    </StyledContainer>
  );
}
