const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for temporary file storage (same as products)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST create service (defaults to pending)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('File:', req.file);

    if (!req.body.serviceTitle) {
      return res.status(400).json({ message: 'Service title is required' });
    }

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'college-marketplace-services', // Separate folder optional
        });
        imageUrl = result.secure_url;
        imagePublicId = result.public_id;
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({ message: "Image upload failed", error: err.message });
      }
    }

    const service = new Service({
      serviceTitle: req.body.serviceTitle,
      description: req.body.description,
      price: req.body.price,
      sellerName: req.body.sellerName,
      sellerContact: req.body.sellerContact,
      imagePublicId,
      imageUrl,
      priceType: req.body.priceType || 'fixed',
      duration: req.body.duration,
      serviceCategory: req.body.serviceCategory,
      location: req.body.location,
      isNegotiable: req.body.isNegotiable === 'true',
      // Defaults: isApproved false, isOutOfService false, status 'pending'
    });

    const newService = await service.save();
    console.log('Saved Service:', newService);
    res.status(201).json(newService);
  } catch (err) {
    console.error('Error:', err.message);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Test Cloudinary (same as products, optional)
router.get("/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all approved services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find({ isApproved: true }); // Only approved (status 'approved')
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Edit service (full update, e.g., change description). Add middleware when ready.
router.put('/:id', /* protect, isAdmin, */ async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    // If new image provided, handle upload (simplified; extend if needed)
    if (req.file) {
      // Delete old image if exists
      if (service.imagePublicId) {
        await cloudinary.uploader.destroy(service.imagePublicId);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'college-marketplace-services',
      });
      service.imageUrl = result.secure_url;
      service.imagePublicId = result.public_id;
      fs.unlinkSync(req.file.path);
      await service.save();
    }
    res.json({ message: 'Service updated', service });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin: Delete service
router.delete('/:id', /* protect, isAdmin, */ async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    // Delete image from Cloudinary
    if (service.imagePublicId) {
      await cloudinary.uploader.destroy(service.imagePublicId);
    }
    await service.remove();
    res.json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Change status (e.g., approve, out_of_service, reject)
router.patch('/:id/status', /* protect, isAdmin, */ async (req, res) => {
  try {
    const { status, reason } = req.body;
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    service.status = status;
    service.reason = reason || service.reason;
    service.isApproved = status === 'approved';
    service.isOutOfService = status === 'out_of_service';
    await service.save();
    res.json({ message: `Status updated to ${status}`, service });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;