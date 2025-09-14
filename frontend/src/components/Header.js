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
    <AppBar position="fixed" sx={{ backgroundColor: theme.palette.header.major, p: { xs: 1, md: 1.5 } }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {/* Logo */}
        <Box sx={{ flexGrow: 1 }}>
          <img src={Logo} alt="BuddyMate Logo" style={{ width: { xs: '75%', sm:'85%', md: '100%' } }} onClick={() => navigate('/')} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, mt: { xs: 1, sm: 0 } }}>
          <Link to="/sell" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.header.sell, color: '#ffffff', minWidth: { xs: '80px', md: '100px' } }}>
              Sell
            </Button>
          </Link>
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.header.button, color: '#ffffff', minWidth: { xs: '120px', md: '140px' } }}>
              Admin Login
            </Button>
          </Link>
          <IconButton
            sx={{ color: (theme) => theme.palette.primary.dark }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;