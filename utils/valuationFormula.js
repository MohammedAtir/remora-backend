// utils/valuationFormula.js
exports.calculateValuation = (financials = {}) => {
  const revenue = Number(financials.revenue || 0);
  const profit = Number(financials.profit || 0);
  const assets = Number(financials.assets || 0);
  // example weighted formula — swap with your business logic later
  return revenue * 0.5 + profit * 1.5 + assets * 0.3;
};
