import { Box, Typography } from '@mui/material';


export function ErrorMessage({ text }: { text: string }) {
  return (
    <Box sx={{ pt: 2 }}>
      <Typography variant="subtitle1" color="error" fontFamily="Avenir Next">{text}</Typography>
    </Box>
  );
}
