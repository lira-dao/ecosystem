import styled from 'styled-components';
import { BaseButton } from './BaseButton';


export const AddToMetamaskButton = styled(BaseButton)`
  width: fit-content;
  background-color: transparent;
  padding: 6px 12px;
  border: 1px solid white;
  margin-top: 6px;
  font-weight: normal;
  
  &:focus {
    outline: none;
  }
`;
