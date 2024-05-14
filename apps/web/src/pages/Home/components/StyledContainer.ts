import styled from 'styled-components';
import { background, BackgroundProps } from 'styled-system';
import { Col } from '@lira-dao/ui';
import daVinciLira from '../../../img/da-vinci-lira.svg';


export const StyledContainer = styled(Col)<BackgroundProps>`
  background: url(${daVinciLira}) no-repeat;

  ${background};
`;
