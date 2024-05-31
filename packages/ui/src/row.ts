import styled from 'styled-components';
import {
  background,
  BackgroundProps,
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  height,
  HeightProps,
  justifyContent,
  JustifyContentProps,
  maxWidth,
  MaxWidthProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  width,
  WidthProps,
} from 'styled-system';

export type RowProps =
  FlexboxProps
  & JustifyContentProps
  & SpaceProps
  & WidthProps
  & MaxWidthProps
  & HeightProps
  & BackgroundProps
  & DisplayProps
  & TextAlignProps

export const Row = styled.div<RowProps>`
  display: flex;

  ${background}
  ${display}
  ${flexbox}
  ${height}
  ${justifyContent}
  ${maxWidth}
  ${space}
  ${textAlign}
  ${width}
`;
