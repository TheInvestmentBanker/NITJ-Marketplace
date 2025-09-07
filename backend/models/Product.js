const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sellerName: { type: String, required: true },
  sellerContact: { type: String, required: true },
  imageUrl: { type: String }, // Store Cloudinary URL
  imagePublicId: { type: String }, // Store Cloudinary public_id
  productAge: { type: String, required: true },
  isNegotiable: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  hasBill: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);