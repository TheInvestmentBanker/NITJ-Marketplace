import { createTheme } from '@mui/material/styles';

let darkMode = false;  // Toggle this boolean for dark/light (one-line change)

// Theme options (change colors here in one place)
const lightThemeOptions = {
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },  // Blue - change this line for entire scheme
    background: { default: '#fff' },
  },
  shape: { borderRadius: 8 },  // Change radius for buttons/shapes
};

const darkThemeOptions = {
  palette: {
    mode: 'dark',
    primary: { main: '#90caf9' },  // Lighter blue for dark - adjust as needed
    background: { default: '#121212' },
  },
  shape: { borderRadius: 8 },
};

export const theme = createTheme(darkMode ? darkThemeOptions : lightThemeOptions);

export const toggleDarkMode = () => {
  darkMode = !darkMode;
  // Re-export or re-render app to apply (we'll handle in App.js)
};