import styled from 'styled-components';
import { Modal } from 'react-overlays';


export const PositionedModal = styled(Modal)`
  position: fixed;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  z-index: 1040;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
`;
