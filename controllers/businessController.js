// controllers/businessController.js
const Business = require('../models/businessModel');
const { calculateValuation } = require('../utils/valuationFormula');

exports.registerBusiness = async (req, res) => {
  try {
    const { name, financials } = req.body;

    const valuation = calculateValuation(financials);
    const numberOfCoins = Math.floor(valuation / 100); // Example logic

    const business = new Business({ name, financials, numberOfCoins });
    await business.save();

    res.status(201).json({ message: 'Business registered', business });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register business', details: err.message });
  }
};
