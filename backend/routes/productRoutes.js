const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for temporary file storage
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

router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('File:', req.file);

    if (!req.body.name) {
      return res.status(400).json({ message: 'Product name is required' });
    }

    let imageUrl = null;
let imagePublicId = null;

if (req.file) {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'college-marketplace',
    });
    imageUrl = result.secure_url;     // <-- actual image URL
    imagePublicId = result.public_id; // <-- cloudinary reference
    fs.unlinkSync(req.file.path);     // clean temp file
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return res.status(500).json({ message: "Image upload failed", error: err.message });
  }
}


    const product = new Product({
  name: req.body.name,
  description: req.body.description,
  price: req.body.price,
  sellerName: req.body.sellerName,
  sellerContact: req.body.sellerContact,
  imagePublicId,
  imageUrl, // add this field
  productAge: req.body.productAge,
  isNegotiable: req.body.isNegotiable === 'true',
  hasBill: req.body.hasBill === 'true',
});

    const newProduct = await product.save();
    console.log('Saved Product:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error:', err.message);
    if (req.file) fs.unlinkSync(req.file.path); // Clean up on error
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

router.get("/test-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.api.ping();
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true }); // only approved
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;