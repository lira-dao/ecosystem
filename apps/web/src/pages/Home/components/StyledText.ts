// import styled from 'styled-components';
// import { fontSize, FontSizeProps, margin, MarginProps, textAlign, TextAlignProps } from 'styled-system';


// export const StyledText = styled.p<FontSizeProps & MarginProps & TextAlignProps>`
//   color: ${props => props.theme.colors.white};
//   font-family: ${props => props.theme.fontFamilies.secondary};
//   ${fontSize};
//   ${textAlign}
//   ${margin}
// `;


import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';

const StyledText = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontFamily: theme.typography.fontFamily,
  // `styled-system` style props can be mapped manually if needed
  // fontSize: theme.typography.fontSize could be dynamically set via props if needed
  // textAlign and margin can be directly applied as props to this component
}));

export default StyledText;