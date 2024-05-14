import styled from '@xstyled/styled-components';

export const BaseButton = styled.buttonBox`
  align-items: center;
  border-radius: 16px;
  border: 1px solid transparent;
  color: white;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  font-weight: 535;
  justify-content: center;
  line-height: 24px;
  outline: none;
  padding: 16px 6px;
  position: relative;
  text-align: center;
  text-decoration: none;
  width: initial;
  z-index: 1;

  &:disabled {
    opacity: 50%;
    cursor: auto;
    pointer-events: none;
  }

  will-change: transform;
  transition: transform 450ms ease;
  transform: perspective(1px) translateZ(0);

  > * {
    user-select: none;
  }

  > a {
    text-decoration: none;
  }
`;
