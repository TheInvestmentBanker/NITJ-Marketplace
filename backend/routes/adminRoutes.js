const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Admin = require('../models/Admin');
const Product = require('../models/Product');
const Service = require('../models/Service'); // New: Import Service model

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const auth = require('../middleware/authMiddleware'); // Assumes this verifies admin via JWT

// login route (unchanged)
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

// Products: List pending (status 'pending')
router.get('/products/pending', auth, async (req, res) => {
  try {
    const pending = await Product.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products: Approve (set status 'approved')
router.put('/products/:id/approve', auth, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isApproved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Approved', product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products: Reject (set status 'rejected' with reason)
router.patch('/products/:id/reject', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reason: reason || 'Rejected by admin' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Rejected', product: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products: Delete (hard remove, with Cloudinary cleanup)
router.delete('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Products: Full Edit (admin update any field, including status)
router.put('/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Sync booleans if status provided
    if (req.body.status) {
      product.isApproved = req.body.status === 'approved';
      product.isSold = req.body.status === 'sold';
    }

    // Handle image update if new publicId provided (from frontend upload)
    if (req.body.imagePublicId && req.body.imagePublicId !== product.imagePublicId) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }
      product.imageUrl = req.body.imageUrl;
      product.imagePublicId = req.body.imagePublicId;
    }

    Object.assign(product, req.body);
    product.updatedAt = Date.now();
    await product.save();
    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Services: List pending (status 'pending')
router.get('/services/pending', auth, async (req, res) => {
  try {
    const pending = await Service.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Services: Approve (set status 'approved')
router.put('/services/:id/approve', auth, async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isApproved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Approved', service: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Services: Reject (set status 'rejected' with reason)
router.patch('/services/:id/reject', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', reason: reason || 'Rejected by admin' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Rejected', service: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Services: Delete (hard remove, with Cloudinary cleanup)
router.delete('/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (service.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(service.imagePublicId);
      } catch (err) {
        console.error('Cloudinary delete error:', err);
      }
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Services: Full Edit (admin update any field, including status)
router.put('/services/:id', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Sync booleans if status provided
    if (req.body.status) {
      service.isApproved = req.body.status === 'approved';
      service.isOutOfService = req.body.status === 'out_of_service';
    }

    // Handle image update if new publicId provided
    if (req.body.imagePublicId && req.body.imagePublicId !== service.imagePublicId) {
      if (service.imagePublicId) {
        await cloudinary.uploader.destroy(service.imagePublicId);
      }
      service.imageUrl = req.body.imageUrl;
      service.imagePublicId = req.body.imagePublicId;
    }

    Object.assign(service, req.body);
    service.updatedAt = Date.now();
    await service.save();
    res.json({ message: 'Service updated', service });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;