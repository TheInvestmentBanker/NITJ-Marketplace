import React, { useEffect } from 'react';
import { Box, Fade } from '@mui/material';
import logo from '../assets/App.png';

function BreatheIn({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish(); // Hide the splash after 2 seconds
    }, 2000);
    return () => clearTimeout(timer); // Cleanup
  }, [onFinish]);

  return (
    <Fade in={true} timeout={5}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          bgcolor: 'primary.main', // Royal Purple (#6B3FA0)
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Airo Parkon Logo"
          sx={{
            maxWidth: '50%',
            maxHeight: '50%',
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)', // White logo for contrast against Royal Purple
            animation: 'heartbeat 1.5s ease-in-out infinite',
            '@keyframes heartbeat': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.1)', opacity: 1 },
              '100%': { transform: 'scale(1)', opacity: 1 },
            },
          }}
        />
      </Box>
    </Fade>
  );
}

export default BreatheIn;