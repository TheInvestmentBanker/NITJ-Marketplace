import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

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
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'grey.100', px: { xs: 2, md: 0 } }}>
      <Paper elevation={3} sx={{ p: { xs: 4, md: 8 }, maxWidth: 'md', width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 4, textAlign: 'center', fontSize: { xs: '1.5rem', md: '1.75rem' } }}>
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
    </Box>
  );
}

export default AdminLogin;