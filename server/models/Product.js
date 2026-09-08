const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['CRICKET', 'BADMINTON', 'FOOTBALL', 'FITNESS', 'RUNNING', 'APPAREL'],
    uppercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  image: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    default: 'ProSport',
  },
  description: {
    type: String,
    default: '',
  },
  rating: {
    type: Number,
    default: 4.8,
  },
  reviewsCount: {
    type: Number,
    default: 24,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: true,
  },
  specs: [{
    label: String,
    value: String,
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
