const Business = require('../models/Business');
const { calculateValuation } = require('../utils/valuationFormula');

exports.createBusiness = async (req, res) => {
  try {
    // requires auth and business_owner role
    const payload = req.body;
    payload.ownerId = req.user.id;
    payload.valuation = calculateValuation(payload.financials || {});
    const b = new Business(payload);
    await b.save();
    res.status(201).json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listBusinesses = async (req, res) => {
  try {
    const list = await Business.find().populate('ownerId', 'name email');
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBusiness = async (req, res) => {
  try {
    const b = await Business.findById(req.params.id).populate('ownerId', 'name email');
    if (!b) return res.status(404).json({ error: 'Not found' });
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const b = await Business.findById(req.params.id);
    if (!b) return res.status(404).json({ error: 'Not found' });

    // allow only owner or admin
    if (String(b.ownerId) !== String(req.user.id) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    Object.assign(b, req.body);
    if (req.body.financials) {
      b.valuation = calculateValuation(req.body.financials);
    }
    await b.save();
    res.json(b);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
