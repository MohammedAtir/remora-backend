const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  totalSupply: { type: Number, default: 0 },
  unitValue: { type: Number, default: 0 },
  mintedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coin', coinSchema);
