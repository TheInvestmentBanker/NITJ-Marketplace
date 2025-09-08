const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const fs = require('fs');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: 'https://nitj-marketplace-3qbg.onrender.com', // Exact frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow common HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
  credentials: true // Enable credentials if needed (e.g., cookies)
}));

// Route handlers
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

app.use('/api/products', productRoutes);

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));