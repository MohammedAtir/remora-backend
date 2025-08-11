const mongoose = require('mongoose');

const txSchema = new mongoose.Schema({
  type: { type: String, enum: ['mint','buy','sell'], required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', default: null },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', default: null },
  coins: { type: Number, default: 0 },
  pricePerCoin: Number,
  total: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', txSchema);
