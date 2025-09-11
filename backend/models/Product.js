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
  hasBill: { type: Boolean, default: false },
  // Keep booleans for compatibility, but use status for control
  isApproved: { type: Boolean, default: false },
  isSold: { type: Boolean, default: false },
  // New: Status enum for granular control (replaces/enhances booleans)
  status: {
    type: String,
    enum: ['pending', 'approved', 'sold', 'rejected'],
    default: 'pending',
  },
  // New: Optional reason for rejection/edit
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Product', productSchema);