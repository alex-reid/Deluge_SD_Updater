import {createTheme} from '@mui/material';
// import {red} from '@mui/material/colors';
import Karla from '../assets/Karla-VariableFont_wght.ttf';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#f50057',
    },
    secondary: {
      main: '#40c4ff',
    },
    error: {
      main: '#f50057',
    },
    text: {
      primary: '#eeeeee',
      secondary: '#e0e0e0',
      disabled: 'rgba(78,78,78,0.38)',
      hint: '#969696',
    },
    divider: 'rgba(212,207,207,0.4)',
    background: {
      paper: '#131111',
      default: '#1a1717',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Karla';
          font-display: swap;
          src: url(${Karla});
        }
      `,
    },
  },
  typography: {
    fontFamily: 'Karla, "Helvetica", "Arial", sans-serif',
    fontWeightMedium: 600,
    fontWeightBold: 800,
    fontWeightLight: 300,
    fontSize: 16,
    fontWeightRegular: 400,
    htmlFontSize: 16,
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTooltip: {
      arrow: true,
    },
  },
});

export default theme;
