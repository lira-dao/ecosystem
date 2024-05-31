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
  maxWidth,
  MaxWidthProps,
  minHeight,
  MinHeightProps,
  minWidth,
  MinWidthProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  width,
  WidthProps,
} from 'styled-system';

export type ColProps = FlexboxProps
  & SpaceProps
  & WidthProps
  & MaxWidthProps
  & MinWidthProps
  & MinHeightProps
  & HeightProps
  & BackgroundProps
  & DisplayProps
  & TextAlignProps

export const Col = styled.div<ColProps>`
  display: flex;
  flex-direction: column;

  ${flexbox}
  ${width}
  ${maxWidth}
  ${minWidth}
  ${minHeight}
  ${height}
  ${space}
  ${background}
  ${display}
  ${textAlign}
`;
