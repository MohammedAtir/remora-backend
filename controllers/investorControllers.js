const Investor = require('../models/Investor');
const Transaction = require('../models/Transaction');
const Coin = require('../models/Coin');
const Business = require('../models/Business');

exports.createInvestor = async (req, res) => {
  try {
    // this is a lightweight create (not a full auth register)
    const inv = new Investor(req.body);
    await inv.save();
    res.status(201).json(inv);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listInvestors = async (req, res) => {
  try {
    const list = await Investor.find().select('-passwordHash -refreshToken');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPortfolio = async (req, res) => {
  try {
    const investorId = req.params.id || req.user.id;
    // fetch transactions where investor is buyer/seller
    const txs = await Transaction.find({
      $or: [{ to: investorId }, { from: investorId }]
    });

    // compute net holdings per businessId
    const holdings = {}; // { businessId: netCoins }
    txs.forEach(tx => {
      const biz = String(tx.businessId);
      holdings[biz] = holdings[biz] || 0;
      if (tx.type === 'buy') {
        if (String(tx.to) === String(investorId)) holdings[biz] += (tx.coins || 0);
        if (String(tx.from) === String(investorId)) holdings[biz] -= (tx.coins || 0);
      } else if (tx.type === 'sell') {
        if (String(tx.from) === String(investorId)) holdings[biz] -= (tx.coins || 0);
        if (String(tx.to) === String(investorId)) holdings[biz] += (tx.coins || 0);
      } else if (tx.type === 'mint') {
        // if mint to this investor (unusual), add
        if (String(tx.to) === String(investorId)) holdings[biz] += (tx.coins || 0);
      }
    });

    // build response array with business info and valuation
    const result = [];
    for (const bizId of Object.keys(holdings)) {
      const netCoins = holdings[bizId];
      if (netCoins === 0) continue;
      const business = await Business.findById(bizId);
      const latestCoin = await Coin.findOne({ businessId: bizId }).sort({ mintedAt: -1 });
      const pricePerCoin = (latestCoin && latestCoin.unitValue) || (business.valuation && business.coinSupply ? (business.valuation / business.coinSupply) : 0);
      result.push({
        business: { id: business._id, name: business.name, sector: business.sector },
        netCoins,
        pricePerCoin,
        value: netCoins * pricePerCoin
      });
    }

    res.json({ portfolio: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
