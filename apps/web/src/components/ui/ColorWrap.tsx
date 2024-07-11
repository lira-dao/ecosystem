import React from 'react';
import { styled } from '@mui/material/styles';

const ColorSpan = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));

type ColorWrapProps = {
  children: React.ReactNode;
};

const ColorWrap: React.FC<ColorWrapProps> = ({ children }) => {
  return <ColorSpan>{children}</ColorSpan>;
};

export default ColorWrap;