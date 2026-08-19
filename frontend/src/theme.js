import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00ffcc' },
    secondary: { main: '#ff0080' },
    background: { default: '#0a0a0a', paper: '#121212' },
    text: { primary: '#f0f0f0', secondary: '#a0a0a0' },
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
    h3: { fontWeight: 700, letterSpacing: '-0.5px' },
    h4: { fontWeight: 600, letterSpacing: '-0.3px' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          boxShadow: '4px 4px 0px #000',
          padding: '10px 24px',
          '&:hover': { boxShadow: '2px 2px 0px #000', transform: 'translate(2px, 2px)' },
        },
        containedPrimary: { backgroundColor: '#00ffcc', color: '#000', '&:hover': { backgroundColor: '#00e6b8' } },
        containedSecondary: { backgroundColor: '#ff0080', color: '#fff', '&:hover': { backgroundColor: '#e60073' } },
        outlined: { border: '2px solid #00ffcc', color: '#00ffcc', boxShadow: '4px 4px 0px #00ffcc' },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          boxShadow: '6px 6px 0px #000',
          backgroundColor: '#1a1a1a',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            border: '2px solid #000',
            boxShadow: '4px 4px 0px #000',
            '& fieldset': { border: 'none' },
            '&:hover': { boxShadow: '2px 2px 0px #000', transform: 'translate(2px, 2px)' },
          },
          '& .MuiInputLabel-root': { fontWeight: 500 },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '2px solid #000',
          boxShadow: '6px 6px 0px #000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: '2px solid #000',
          boxShadow: '6px 6px 0px #000',
          backgroundColor: '#121212',
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#0a0a0a', fontFamily: '"Outfit", sans-serif' },
      },
    },
  },
});

export default theme;