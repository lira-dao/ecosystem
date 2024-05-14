import { styled, th } from '@xstyled/styled-components';


export const PrimaryButton = styled.buttonBox`
  width: 100%;
  background-color: green-yellow-600;
  font-size: 20px;
  font-weight: 535;
  padding: 16px;
  color: ${th.color('white')};

  align-items: center;
  border-radius: 16px;
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  line-height: 24px;
  outline: none;
  position: relative;
  text-align: center;
  text-decoration: none;
  z-index: 1;
  
  &:focus {
    box-shadow: 0 0 0 1pt green-yellow-600;
    background-color: green-yellow-600;
    outline: none;
  }
  &:hover {
    background-color: green-yellow-600;
    color: white;
  }
  &:active {
    box-shadow: 0 0 0 1pt green-yellow-700;
    background-color: green-yellow-700;
  }
  &:disabled {
    background-color: gray94;
    color: gray155;
    cursor: auto;
    box-shadow: none;
    border: 1px solid transparent;
    outline: none;
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
`
