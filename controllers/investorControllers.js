// controllers/investorController.js
const Investor = require('../models/Investor');

exports.createInvestor = async (req, res) => {
  try {
    const newInvestor = new Investor(req.body);
    const savedInvestor = await newInvestor.save();
    res.status(201).json(savedInvestor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
