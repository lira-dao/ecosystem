import { Button, ButtonProps } from '@mui/material';

export const BaseButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      {...props}
      sx={{
        alignItems: 'center',
        borderRadius: '16px',
        border: '1px solid transparent',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        flexWrap: 'nowrap',
        fontWeight: 535,
        justifyContent: 'center',
        lineHeight: '24px',
        padding: '16px 6px',
        position: 'relative',
        textAlign: 'center',
        textDecoration: 'none',
        width: 'initial',
        zIndex: 1,
        transition: 'background-color 250ms ease-out',
        '&:disabled': {
          opacity: 0.5,
          cursor: 'auto',
          pointerEvents: 'none',
        },
        '&:focus': {
          outline: 'none',
        },
        '> *': {
          userSelect: 'none',
        },
        '> a': {
          textDecoration: 'none',
        },
      }}
    >
      {props.children}
    </Button>
  );
};
