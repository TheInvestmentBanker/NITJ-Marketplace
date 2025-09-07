const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const fs = require('fs');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://nitj-marketplace-3qbg.onrender.com' // Adjust to your frontend URL
}));

const adminRoutes = require('./routes/adminRoutes');
// after app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));