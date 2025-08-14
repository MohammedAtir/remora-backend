const Business = require('../models/Business');
const Coin = require('../models/Coin');
const Transaction = require('../models/Transaction');
const { calculateValuation } = require('../utils/valuationFormula');
const asyncHandler = require('../utils/asyncHandler');

exports.mint = asyncHandler(async (req, res) => {
  const { businessId, amount } = req.body;
  if (!amount || amount <= 0) return res.status(400).json({ error: 'invalid amount' });
  const business = await Business.findById(businessId);
  if (!business) return res.status(404).json({ error: 'not found' });

  if (String(business.ownerId) !== String(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'forbidden' });
  }

  // recalc valuation BEFORE/AFTER depending on your economic model. We'll recalc here:
  const valuation = calculateValuation(business.financials || {});
  // new unitValue could be valuation / (existingSupply + amount)
  const newSupply = (business.coinSupply || 0) + amount;
  const unitValue = newSupply ? (valuation / newSupply) : 0;

  // create coin record
  const coin = await Coin.create({ businessId, totalSupply: amount, unitValue });

  // update business
  business.coinSupply = newSupply;
  business.valuation = valuation;
  await business.save();

  // create mint transaction; credit owner 'to' field
  await Transaction.create({
    type: 'mint',
    businessId,
    to: business.ownerId,
    coins: amount,
    pricePerCoin: unitValue,
    total: unitValue * amount
  });

  res.status(201).json({ coin, business });
});
