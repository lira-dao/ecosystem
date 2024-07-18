import { Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { muiDarkTheme } from '../../theme/theme';

export interface SwapHeaderProps {
  title: string;
  showBack?: boolean;
}

export function SwapHeader({ title, showBack = true }: SwapHeaderProps) {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={muiDarkTheme}>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box width="25px">
          {showBack && <ArrowBackIosIcon cursor="pointer" onClick={() => navigate(-1)} />}
        </Box>

        <Typography variant="h3" color="white">
          {title}
        </Typography>

        <Box width="25px">
        </Box>
      </Box>
    </ThemeProvider>
  );
}
