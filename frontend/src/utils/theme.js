import { createTheme } from '@mui/material/styles';

// Light theme
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Blue for primary actions
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff',
    },
    background: {
      default: '#f2f2f2', // Light background
      paper: '#fff', // White for cards
    },
    text: {
      primary: '#000',
      secondary: '#555',
    },
    logo: {
      filter: 'none', // Normal logo for light mode
    },
  },
  shape: {
    borderRadius: 4,
  },
});

// Dark theme (default)
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Lighter blue for dark mode
      light: '#e3f2fd',
      dark: '#42a5f5',
      contrastText: '#000',
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Slightly lighter for cards
    },
    text: {
      primary: '#fff',
      secondary: '#b0b0b0',
    },
    logo: {
      filter: 'brightness(0) invert(1)', // White logo for dark mode
    },
  },
  shape: {
    borderRadius: 4,
  },
});

// Utility to get theme based on darkMode state
export const getTheme = (darkMode) => (darkMode ? darkTheme : lightTheme);