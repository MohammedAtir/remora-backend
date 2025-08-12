const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  type: { type: String, enum: ['buy','sell'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Investor', required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  coins: { type: Number, required: true },
  pricePerCoin: { type: Number, required: true },
  filled: { type: Number, default: 0 }, // coins already matched
  status: { type: String, enum: ['open','partially_filled','filled','cancelled'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Order', OrderSchema);
