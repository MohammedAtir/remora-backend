// utils/valuationFormula.js

exports.calculateValuation = (financials) => {
  const { revenue = 0, profit = 0, assets = 0 } = financials;

  // Sample formula: weighted average valuation
  const valuation = (revenue * 0.5) + (profit * 1.5) + (assets * 0.3);
  return valuation;
};
