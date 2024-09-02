import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';


export interface SectionHeaderProps {
  title: string;
  showBack?: boolean;
}

export function SectionHeader({ title, showBack = true }: SectionHeaderProps) {
  const navigate = useNavigate();

  return (
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

      <Typography variant="h3" mb={4} color="white">
        {title}
      </Typography>

      <Box width="25px">
      </Box>
    </Box>
  );
}
