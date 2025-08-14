const Transaction = require('../models/Transaction');
const Business = require('../models/Business');
const Coin = require('../models/Coin');

exports.createTransaction = async (req, res) => {
  try {
    // body: { type, businessId, coins, pricePerCoin, from (optional), to (optional) }
    const { type, businessId, coins, pricePerCoin } = req.body;
    const tx = new Transaction({
      type,
      businessId,
      from: req.body.from || null,
      to: req.body.to || req.user.id, // default to authenticated user
      coins,
      pricePerCoin,
      total: (pricePerCoin || 0) * (coins || 0)
    });
    await tx.save();

    // optionally update business coinSupply or coin model on mint — omitted for simplicity
    res.status(201).json(tx);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
