import { createTheme } from '@mui/material/styles';

export const ACCENT = '#00D4FF';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ACCENT,
      light: '#33DDFF',
      dark: '#0099BB',
    },
    secondary: {
      main: '#0066CC',
    },
    background: {
      default: '#0A0E1A',
      paper: '#111827',
    },
    text: {
      primary: '#E8EAF0',
      secondary: '#9BA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.03em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    body1: { lineHeight: 1.75 },
    body2: { lineHeight: 1.65 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});

export default theme;
