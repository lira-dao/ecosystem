import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import muiTheme from '../../../theme_mui';

interface StyledDividerProps {
  width?: string | number;
  height?: string | number;
  margin?: string | number;
}

const StyledDivider = styled(Box)<StyledDividerProps>(({ theme, width, height, margin }) => ({
  backgroundColor: muiTheme.palette.primary.main,
  width,
  height,
  margin
}));

export default StyledDivider;