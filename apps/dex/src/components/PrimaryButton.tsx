import { styled } from '@mui/material/styles';
import Button, { ButtonProps } from '@mui/material/Button';
import { green } from '../theme/theme';


export const PrimaryButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(green[600]),
  fontSize: theme.typography.h6.fontSize,
  backgroundColor: green[600],
  '&:hover': {
    backgroundColor: green[500],
  },
  '&:focus': {
    outline: 'none',
  }
}));
