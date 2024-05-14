import styled from 'styled-components';
import { Col } from '@satoshi-lira/ui';
import { height, HeightProps } from 'styled-system';


export const StyledContainerRadialBackground = styled(Col)<HeightProps>`
  max-width: 2048px;
  justify-content: center;
  background: rgb(47, 228, 237);
  background: radial-gradient(ellipse, rgba(47, 228, 237, 0.2) 0%, rgba(10, 10, 10, 1) 70%);

  ${height}
`;
