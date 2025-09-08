import { AppBar, Toolbar, Typography, IconButton, Switch, Button } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { toggleDarkMode, theme } from '../utils/theme';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isDark, setIsDark] = useState(false);

  const handleToggle = () => {
    toggleDarkMode();
    setIsDark(!isDark);
    // Note: For theme to update, you may need to reload or use context
  };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between">
        <Typography variant="h6" className="font-bold">
          College Marketplace
        </Typography>
        <div className="flex items-center space-x-4">
          <Link to="/sell">
            <Button variant="contained" color="secondary">
              Sell
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="contained" color="primary">
              Admin Login
            </Button>
          </Link>
          <IconButton color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
          <Switch checked={isDark} onChange={handleToggle} />
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Header;