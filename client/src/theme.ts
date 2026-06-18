import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Heebo", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#00c896',
      light: '#5ce0b8',
      dark: '#00956f',
    },
    secondary: {
      main: '#4dabf7',
    },
    background: {
      default: '#0b1020',
      paper: '#121a2f',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
    success: { main: '#00c896' },
    warning: { main: '#ffb020' },
    error: { main: '#ff6b6b' },
    info: { main: '#4dabf7' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});
