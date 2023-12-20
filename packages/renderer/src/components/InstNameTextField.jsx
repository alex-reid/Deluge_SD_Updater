import {TextField, styled} from '@mui/material';
import theme from '../theme';
export const errorColor = theme.palette.primary.main;

export const InstNameTextField = styled(TextField)({
  margin: 0,
  padding: 0,
  minWidth: '28rem',
  width: '50%',
  marginBottom: '16px',
  '& .MuiFormLabel-root': {
    fontWeight: 700,
    fontSize: '1.4rem',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      fontSize: '1.2rem',
      transform: 'translate(0px, 0px) scale(0.75)',
      color: theme.palette.text.primary,
      '&.Mui-error': {
        color: errorColor,
      },
    },
  },
  '& .MuiInputBase-root': {
    fontWeight: 700,
    fontSize: '1.4rem',
    '& input': {
      padding: 0,
      color: theme.palette.secondary.main,
      '&[aria-invalid=true]': {
        color: errorColor,
      },
    },
    '&:before': {
      border: 'none',
      borderWidth: '2px',
      borderColor: theme.palette.divider,
    },
    '&:hover::before': {
      borderWidth: '2px',
      borderColor: theme.palette.divider,
    },
    '&::after': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-error:after': {
      borderColor: errorColor,
    },
    '&:hover:after': {
      borderWidth: '2px',
      borderColor: theme.palette.primary.main, //'transparent',
    },
  },
  '& .MuiFormHelperText-root': {
    position: 'absolute',
    top: '3.1rem',
    fontSize: '1rem',
    lineHeight: '1rem',
    '&.Mui-error': {
      color: errorColor,
    },
  },
});
