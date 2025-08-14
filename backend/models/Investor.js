const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },          // Changed from passwordHash to password
  role: { type: String, enum: ['investor','business_owner','admin'], default: 'investor' },
  walletBalance: { type: Number, default: 0 },
  refreshToken: { type: String },          // stored refresh token (simple approach)
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investor', investorSchema);