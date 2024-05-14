import styled from 'styled-components';
import { Colors } from '../../theme';


export const ColorWrap = styled.span<{ color: keyof Colors }>`
  margin: 0;
  color: ${({ color, theme }) => theme.colors[color]};
`;
