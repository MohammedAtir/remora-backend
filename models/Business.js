const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sector: String,
  valuation: Number,
  description: String,
  ownerEmail: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
