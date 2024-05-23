import { NavLink, useLocation } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { Row } from '@lira-dao/ui';
import { GlobalStyles, Typography } from '../ui';
import logo from '../../img/logo-dao.png';
import button from '../../img/enter-app.svg';
import theme from '../../theme';
import React from 'react';


const StyledMenuItem = styled(Typography)`
  color: ${props => props.theme.colors['white-80']};
  cursor: pointer;
  font-weight: 400;
  line-height: 27px;

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


export function Header() {
  const location = useLocation();

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Row
        height={176}
        margin={['20px 20px 0', '0 20px', '0 20px', '0 20px']}
        flexDirection={['column', 'row', 'row', 'row']}
        justifyContent="space-between"
        alignItems="center"
      >
        <Row width={[1, 1 / 3]} justifyContent={['center', 'flex-start']}>
          <NavLink to="/">
            <img src={logo} alt="lira dao logo" />
          </NavLink>
        </Row>

        <Row justifyContent="center">
          <a href="https://whitepaper.liradao.org" target="_blank" rel="noreferrer">
            <StyledMenuItem marginX={28}>
              WHITEPAPER
            </StyledMenuItem>
          </a>

          <NavLink to="/tokens">
            <StyledMenuItem marginX={28}>
              TOKENS
            </StyledMenuItem>
          </NavLink>
        </Row>

        <Row width={1 / 3} justifyContent="flex-end" display={['none', 'none', 'none', 'flex']}>
          <a href="https://dex.liradao.org" target="_blank" rel="noreferrer">
            <img src={button} width={200} alt="Buy LDT" />
          </a>
        </Row>
      </Row>
    </ThemeProvider>
  );
}
