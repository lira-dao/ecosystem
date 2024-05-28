import styled from 'styled-components';
import { th } from '@xstyled/styled-components';


interface TabItemProps {
  $active: boolean;
}

export const StyledTabItem = styled.h3<TabItemProps>`
  padding: 8px 16px;
  color: ${props => props.$active ? th.color('primary') : 'white'};
  font-size: ${th.fontSize('l')};
  cursor: pointer;

  background: ${props => props.$active ? th.color('gray34') : 'transparent'};
  border-radius: ${props => props.$active ? '20px' : '0'};
`;
