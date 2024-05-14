import styled from 'styled-components';

export const StyledButton = styled.button`
  display: flex;
  max-width: 280px;
  align-items: center;
  background-color: transparent;
  padding: 8px 10px;
  border: 1px ${props => props.theme.colors.secondary} solid;
  border-radius: 50px;
  cursor: pointer;

  & > img {
    margin-right: 8px;
  }

  &:active {
    border: 1px ${props => props.theme.colors.secondary} solid;
  }
`;
