import styled from '@xstyled/styled-components';


export const InputPanel = styled.box<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 4px;
  z-index: 1;
  width: 100%;
  height: 100%;
  transition: height 1s ease;
  will-change: height;
`;
