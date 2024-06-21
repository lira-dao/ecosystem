import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import daVinciLira from '../../../img/da-vinci-lira.svg';


interface StyledContainerProps {
  children?: React.ReactNode;
  backgroundPosition: string[];
  sx?: SxProps<Theme>;
}

export const StyledContainer: React.FC<StyledContainerProps> = ({
  children,
  backgroundPosition,
  sx
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        background: `url(${daVinciLira}) no-repeat`,
        backgroundPosition: {
          xs: backgroundPosition[0],
          sm: backgroundPosition[1],
          md: backgroundPosition[2],
          lg: backgroundPosition[3],
        },
        ...sx
      }}
    >
      {children}
    </Box>
  );
};
