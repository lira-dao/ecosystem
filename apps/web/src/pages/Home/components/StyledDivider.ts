import styled from 'styled-components';
import { height, HeightProps, margin, MarginProps, width, WidthProps } from 'styled-system';


export const StyledDivider = styled.div<WidthProps & HeightProps & MarginProps>`
  background-color: ${props => props.theme.colors.primary};

  ${width}
  ${height}
  ${margin}
`;
