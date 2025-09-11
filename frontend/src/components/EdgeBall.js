import React, { memo, useCallback, useState } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { FaBars, FaHome, FaShoppingCart, FaMapMarkerAlt, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EdgeBall = memo(() => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleToggle = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const scrollToBox = (boxId) => {
    const box = document.getElementById(boxId);
    if (box) {
      box.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Use theme's primary.main for submenu icons
  const submenuBgColor = theme.palette.mode === 'dark' ? '#94C05F' : '#E91d18';
  const submenuHoverColor = theme.palette.primary.dark || theme.palette.primary.main; // Fallback to main if dark not defined
  
  // Reverse edge ball color based on theme mode
  const toggleBgColor = theme.palette.mode === 'dark' ? '#94C05F' : '#E91d18'; // Red in dark, Green in light
  const iconButtonColor = '#ffffff';

  return (
    <Box sx={{ position: 'fixed', bottom: '30px', right: '25px' }}>
      <IconButton
        aria-label="Toggle Navigation"
        onClick={handleToggle}
        sx={{
          width: '60px',
          height: '60px',
          bgcolor: toggleBgColor,
          color: iconButtonColor,
          borderRadius: '50%',
          zIndex : '1001',
          boxShadow: theme.palette.mode === 'dark' ?  '#E91d18' : '#94C05F',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.1)', bgcolor: toggleBgColor },
        }}
      >
        <FaBars size={20} />
      </IconButton>
      <Box
        sx={{
          position: 'absolute',
          bottom: '0px',
          right: '0px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex : '999',
          gap: '0px',
          transform: open ? 'scale(1)' : 'scale(0)',
          transformOrigin: 'bottom right',
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        <IconButton
          aria-label="Home"
          onClick={() => scrollToBox('hero')}
          sx={{
            width: '50px',
            height: '50px',
            bottom: '-30px',
            right: '0px',
            bgcolor: submenuBgColor,
            zIndex : '999',
            color: '#fff',
            borderRadius: '50%',
            '&:hover': { bgcolor: submenuHoverColor },
          }}
        >
          <FaHome size={20} />
        </IconButton>
        <IconButton
          aria-label="Products"
          onClick={() => navigate('/products')}
          zIndex="999"
          sx={{
            width: '50px',
            height: '50px',
            bottom: '-5px',
            right: '56px',
            bgcolor: submenuBgColor,
            zIndex : '999',
            color: '#fff',
            borderRadius: '50%',
            '&:hover': { bgcolor: submenuHoverColor },
          }}
        >
          <FaShoppingCart size={20} />
        </IconButton>
        <IconButton
          aria-label="Locations"
          onClick={() => scrollToBox('locations')}
          zIndex="999"
          sx={{
            width: '50px',
            height: '50px',
            bottom: '8px',
            right: '101px',
            bgcolor: submenuBgColor,
            zIndex : '999',
            color: '#fff',
            borderRadius: '50%',
            '&:hover': { bgcolor: submenuHoverColor },
          }}
        >
          <FaMapMarkerAlt size={20} />
        </IconButton>
        <IconButton
          aria-label="WhatsApp"
          onClick={() => window.open('https://wa.me/+917888824366', '_blank')} // Replace +1234567890 with the actual company WhatsApp number
          zIndex="999"
          sx={{
            width: '50px',
            height: '50px',
            bottom: '9px',
            right: '139px',
            bgcolor: submenuBgColor,
            zIndex : '999',
            color: '#fff',
            borderRadius: '50%',
            '&:hover': { bgcolor: submenuHoverColor },
          }}
        >
          <FaWhatsapp size={20} />
        </IconButton>
        <IconButton
          aria-label="Contact"
          onClick={() => scrollToBox('contact')}
          zIndex="999"
          sx={{
            width: '50px',
            height: '50px',
            bottom: '0px',
            right: '159px',
            bgcolor: submenuBgColor,
            zIndex : '999',
            color: '#fff',
            borderRadius: '50%',
            '&:hover': { bgcolor: submenuHoverColor },
          }}
        >
          <FaEnvelope size={20} />
        </IconButton>
      </Box>
    </Box>
  );
});

export default EdgeBall;