import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Logo from '../assets/App.png';
import { useNavigate } from 'react-router-dom';
import { DarkMode, LightMode, Mail } from '@mui/icons-material';

function Header({ darkMode, setDarkMode }) {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ backgroundColor: theme.palette.header.major, padding : '5px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Box sx={{ flexGrow: 1 }}>
          <img src={Logo} alt="BuddyMate Logo" style={{ height: '40px' }} onClick={() => navigate('/')}/>
        </Box>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/sell" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.header.sell, color: '#ffffff'}}>
              Sell
            </Button>
          </Link>
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.header.button, color: '#ffffff'}}>
              Admin Login
            </Button>
          </Link>
          <IconButton
            sx={{Color: (theme) => theme.palette.primary.dark}}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;