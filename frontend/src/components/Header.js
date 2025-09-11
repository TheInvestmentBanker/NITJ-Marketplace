import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

function Header({ darkMode, setDarkMode }) {
  const theme = useTheme();

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.primary.dark }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          College Marketplace
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/sell" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="secondary">
              Sell
            </Button>
          </Link>
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary">
              Admin Login
            </Button>
          </Link>
          <IconButton
            sx={{ color: '#4682B4' }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;