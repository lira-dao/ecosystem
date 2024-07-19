import { PacmanLoader } from 'react-spinners';
import { useTheme } from '@mui/material/styles';
import { PrimaryButton } from './PrimaryButton';

interface PrimaryButtonWithLoaderProps {
  isLoading: boolean;
  isDisabled: boolean;
  text: string;
  onClick: () => void;
}

export function PrimaryButtonWithLoader({ isLoading, isDisabled, onClick, text }: PrimaryButtonWithLoaderProps) {
  const th = useTheme();

  return isLoading ? (
    <PacmanLoader color={th.colors.green[100]} />
  ) : (
    <PrimaryButton
      variant="contained"
      size="large"
      disabled={isDisabled}
      onClick={onClick}
    >{text}</PrimaryButton>
  );
}
