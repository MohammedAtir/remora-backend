// models/Investor.js
const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  budget: Number,
  interestedSectors: [String]
});

module.exports = mongoose.model('Investor', investorSchema);
