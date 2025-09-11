import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { getTheme } from './utils/theme';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';

// Default to dark mode for now (you can make this dynamic later)
const theme = getTheme(true);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  </React.StrictMode>
);

// For Tailwind dark mode: document.documentElement.classList.add('dark') if darkMode true (add logic here if needed)
