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
    <Box className="flex justify-center items-center min-h-screen bg-gray-100">
      <Paper elevation={3} className="p-8 max-w-md w-full">
        <Typography variant="h5" className="mb-4 text-center">
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" className="mb-2">
              {error}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            className="mt-4"
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default AdminLogin;
