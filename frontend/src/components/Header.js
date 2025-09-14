import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Logo from '../assets/App.png';
import { useNavigate } from 'react-router-dom';
import { DarkMode, LightMode, Mail } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import SLogo from '../assets/Mar.png';

function Header({ darkMode, setDarkMode }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ backgroundColor: theme.palette.header.major, p: { xs: 1, md: 1.5 } }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        {/* Logo */}
        <Box sx={{ flexGrow: 1, maxWidth: {  xs: '16%', sm: '15%', md: '17%' } }}>
          <img src={isMobile? SLogo : Logo } alt="BuddyMate Logo" onClick={() => navigate('/')} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 2 }, mt: 0 }}>
          <Link to="/sell" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.header.sell, color: '#ffffff', maxWidth: { xs: '60px', md: '100px' } }}>
              Sell
            </Button>
          </Link>
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ backgroundColor: theme.palette.header.button, color: '#ffffff', minWidth: { xs: '120px', md: '145px' } }}>
              Admin Login
            </Button>
          </Link>
          <IconButton
            sx={{ color: (theme) => theme.palette.primary.dark, paddingLeft: '-25px', }}
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