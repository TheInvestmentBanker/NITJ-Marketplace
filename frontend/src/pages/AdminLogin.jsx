import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Container } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const theme = useTheme();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password,
      });

      // just check if token exists
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Try again.");
    }
  };

  return (
    <Box sx={{ 
     py: { xs: 15, md: 12 }, 
     backgroundColor: (theme) => theme.palette.background.paper,
     borderRadius: 0, 
     boxShadow: 3, 
     display: 'flex',               // ✅ make it flexbox
     justifyContent: 'center',      // ✅ horizontal center
     alignItems: 'center',          // ✅ vertical center
     minHeight: '100vh',  
     }}>
      <Container maxWidth="lg">
      <Paper elevation={3} className="p-8 max-w-md w-full ">
        <Typography variant="h2" alignItems="center" textAlign="center" sx={{fontSize: '2rem', paddingTop:'15px', paddingBottom:'25px', color: theme.palette.text.secondary,}}>
          Admin Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, py: 1.5 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Container>
    </Box>
  );
}

export default AdminLogin;