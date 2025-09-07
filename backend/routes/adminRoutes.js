const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require('../models/Admin');
const Product = require('../models/Product');

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const auth = require('../middleware/authMiddleware');

// login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, username: admin.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// list pending products (protected)
router.get('/products/pending', auth, async (req, res) => {
  try {
    const pending = await Product.find({ isApproved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// approve a product (protected)
router.put('/products/:id/approve', auth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Approved', product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// reject/delete a product (protected) - also delete cloudinary image to save credits
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
        // continue to delete DB record even if cloudinary fails
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
