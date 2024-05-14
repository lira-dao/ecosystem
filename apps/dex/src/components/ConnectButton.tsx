import { styled } from '@xstyled/styled-components';
import connect from '../img/connect-button.png';


export const ConnectButton = styled.buttonBox`
  width: 164px;
  height: 44px;
  cursor: pointer;
  display: inline-block;
  
  font-size: 16px;
  font-weight: 500;
  background-color: #0a0a0a;
  background-image: url(${connect});

  transition: 200ms ease;

  &:hover {
    transform: translateX(-6px);
  }

  &:active {
    border: none;
  }
  
  &:focus {
    border: none;
    outline: none;
  }
`;
