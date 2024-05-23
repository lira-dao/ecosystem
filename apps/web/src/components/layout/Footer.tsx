import { NavLink } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Col, Row } from '@lira-dao/ui';
import { Typography } from '../ui';
import logo from '../../img/logo-dao.png';
import twitter from '../../img/twitter.svg';
import discord from '../../img/discord.svg';
import theme from '../../theme';


const StyledFooterTitle = styled(Typography)`
  color: ${props => props.theme.colors['white']};
  font-weight: 700;
  line-height: 48px;
  font-size: 32px;
  letter-spacing: 0em;
  text-align: left;

  text-decoration-line: underline;
`;

const StyledFooterItem = styled(Typography)`
  color: ${props => props.theme.colors['white-80']};
  cursor: pointer;
  font-weight: 400;
  line-height: 26px;

  ::selection {
    color: inherit;
    background: transparent;
    text-shadow: none;
  }

  /* For Mozilla Firefox */

  ::-moz-selection {
    color: inherit;
    background: transparent;
    text-shadow: none;
  }

  &:hover {
    color: ${props => props.theme.colors.white};
  }

  &:active {
    color: ${props => props.theme.colors.primary};
  }
`;

const StyledFooterText = styled(Typography)`
  color: ${props => props.theme.colors['white']};
  font-weight: 700;
  line-height: 26px;
`;

export function Footer() {
  return (
    <ThemeProvider theme={theme}>
      <Col margin={['20px 20px 0']} marginTop={['80px']}>
        <Row
          width={['100%']}
          marginBottom={['50px']}
          flexDirection={['column', 'row', 'row', 'row']}
          justifyContent="space-around"
        >
          <Col width={[1, 1 / 3]} flexDirection={['column']} justifyContent={'center'}>
            <Row>
              <NavLink to="/">
                <img src={logo} height={66} alt="lira dao logo" />
              </NavLink>
            </Row>
            <Row>
              <a href="https://twitter.com/LIRA_DAO" target="_blank" rel="noreferrer" style={{ margin: '16px' }}>
                <img src={twitter} height={28} alt="lira dao twitter" />
              </a>
              <a href="https://discord.gg/fDRBajCB9V" target="_blank" rel="noreferrer" style={{ margin: '16px' }}>
                <img src={discord} height={28} alt="lira dao discord" />
              </a>
            </Row>
          </Col>

          <Col width={[1, 1 / 3]} alignItems={'stretch'}>
            <StyledFooterTitle>
              SECTIONS
            </StyledFooterTitle>

            <Row>
              <Col width={[1 / 2]}>
                <a href="https://whitepaper.liradao.org" target="_blank" rel="noreferrer">
                  <StyledFooterItem>
                    White Paper
                  </StyledFooterItem>
                </a>
              </Col>

              {/* <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Ecosystem
                </StyledFooterItem>
              </NavLink>
            </Col> */}

              {/* <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Token Economics
                </StyledFooterItem>
              </NavLink>
            </Col> */}
            </Row>

            {/* <Row>
            <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Mining
                </StyledFooterItem>
              </NavLink>
            </Col>

            <Col width={[1 / 2]}>
              <a href='https://whitepaper.liradao.org' target="_blank" rel="noreferrer">
                <StyledFooterItem>
                  White Paper
                </StyledFooterItem>
              </a>
            </Col>
          </Row> */}

            {/* <Row>
            <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Blockchain Data
                </StyledFooterItem>
              </NavLink>
            </Col>
          </Row> */}
          </Col>

          <Col width={[1, 1 / 3]}>
            <StyledFooterTitle>
              INFO
            </StyledFooterTitle>

            <Row>
              <Col width={[1 / 2]}>
                <NavLink to="/">
                  <StyledFooterItem>
                    LIRA DAO
                  </StyledFooterItem>
                </NavLink>
                {/*<NavLink to="/blockchain-data">
                <StyledFooterItem>
                  Blockchain Data
                </StyledFooterItem>
              </NavLink>*/}
              </Col>

              {/* <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Blog
                </StyledFooterItem>
              </NavLink>
            </Col> */}
            </Row>

            {/* <Row>
            <Col width={[1 / 2]}>
                <NavLink to="/">
                    <StyledFooterItem>
                      Contact
                    </StyledFooterItem>
                </NavLink>
            </Col>

            <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Jobs
                </StyledFooterItem>
              </NavLink>
            </Col>
          </Row> */}

            {/* <Row>
            <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Sponsors
                </StyledFooterItem>
              </NavLink>
            </Col>
          </Row> */}

            {/* <Row>
            <Col width={[1 / 2]}>
              <NavLink to="/">
                <StyledFooterItem>
                  Support
                </StyledFooterItem>
              </NavLink>
            </Col>
          </Row> */}
          </Col>
        </Row>

        <Row width={'100%'}>
          <Col width={[1, 1, 1, 1 / 2]}>
            <StyledFooterText>©2024 LIRA DAO. All rights reserved</StyledFooterText>
          </Col>

          {/* <Col width={[1 / 2]} alignItems={['right']}>
          <Row justifyContent={'end'}>
            <a href='https://whitepaper.liradao.org' target="_blank" rel="noreferrer">
              <StyledFooterItem marginRight={53}>
                Terms of use
              </StyledFooterItem>
            </a>

            <NavLink to="/">
              <StyledFooterItem marginX={53}>
                Privacy policy
              </StyledFooterItem>
            </NavLink>

            <NavLink to="/">
              <StyledFooterItem marginX={53}>
                Cookies policy
              </StyledFooterItem>
            </NavLink>
          </Row>
        </Col> */}
        </Row>
      </Col>
    </ThemeProvider>
  );
}
