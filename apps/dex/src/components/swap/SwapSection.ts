import styled from '@xstyled/styled-components';


export const SwapSection = styled.box`
  display: flex;
  align-items: center;
  background-color: eerie-black;
  border-radius: 16px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  height: 120px;
  line-height: 20px;
  padding: 16px;
  position: relative;

  &:before {
    box-sizing: border-box;
    background-size: 100%;
    border-radius: inherit;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    content: '';
    border: 1px solid;
    border-color: eerie-black;
  }

  &:hover:before {
    border-color: green-yellow-950;
  }

  &:focus-within:before {
    border-color: green-yellow-800;
  }
`;