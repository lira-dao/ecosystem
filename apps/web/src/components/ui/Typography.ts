import styled from 'styled-components';
import {
  color,
  ColorProps,
  compose,
  flexGrow,
  FlexGrowProps,
  FontSizeProps,
  space,
  SpaceProps,
  system,
  typography,
  TypographyProps as StyledTypographyProps,
} from 'styled-system';
import { Colors, FontFamilies, FontSizes, LineHeights } from '../../theme';

export const Text = styled('p')(
  compose(
    typography,
    space,
    color,
  ),
);

export interface TypographyProps extends SpaceProps, ColorProps, StyledTypographyProps, FontSizeProps, FlexGrowProps {
  as?: keyof FontSizes;
  fontFamily?: keyof FontFamilies;
  lineHeight?: keyof LineHeights;
  fontSize?: keyof FontSizes;
  color?: keyof Colors;
  wordBreak?: string;
  cursor?: string;
}

const customProps = () => {
  return system({ wordBreak: true, whiteSpace: true });
};

export const Typography = styled(Text)<TypographyProps>`
  color: ${({ color, theme }) => theme.colors[color || 'white']};
  font-family: ${({ fontFamily, theme }) => theme.fontFamilies[fontFamily || 'primary']};
  font-size: ${({ as, fontSize, theme }) => theme.fontSizes[fontSize || as || 'p']};
  line-height: ${({ as, fontSize, lineHeight, theme }) => theme.lineHeights[lineHeight || fontSize || as || 'p']};

  cursor: ${({ cursor }) => cursor};

  ${flexGrow}
  ${customProps}
`;
