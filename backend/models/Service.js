const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceTitle: { type: String, required: true }, // Like name, but for service
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sellerName: { type: String, required: true },
  sellerContact: { type: String, required: true },
  imageUrl: { type: String }, // Single Cloudinary URL
  imagePublicId: { type: String }, // Single Cloudinary public_id
  priceType: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
  duration: { type: String }, // e.g., "1 hour session"
  serviceCategory: { type: String, required: true }, // e.g., "Tutoring"
  location: { type: String }, // Optional for in-person
  isNegotiable: { type: Boolean, default: false },
  // No hasBill for services
  // Booleans for compatibility
  isApproved: { type: Boolean, default: false },
  isOutOfService: { type: Boolean, default: false }, // Like isSold, but for services
  // Status enum (tailored: 'out_of_service' instead of 'sold')
  status: {
    type: String,
    enum: ['pending', 'approved', 'out_of_service', 'rejected'],
    default: 'pending',
  },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update updatedAt on save
serviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Service', serviceSchema);