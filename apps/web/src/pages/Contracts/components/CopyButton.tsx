import { Typography } from '@mui/material';


interface CopyButtonProps {
  children: React.ReactNode;
  onClick: any;
}

const CopyButton: React.FC<CopyButtonProps> = ({ children, onClick }) => (
  <Typography
    sx={{
      color: 'text.secondary', // 'white-80'
      cursor: 'pointer',
      fontSize: '12px',
      lineHeight: '26px',
      marginLeft: '4px',

      '&::selection': {
        color: 'inherit',
        backgroundColor: 'transparent'
      }
    }}
    onClick={onClick}
  >
    {children}
  </Typography>
);

export default CopyButton;
