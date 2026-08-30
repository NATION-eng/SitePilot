import PRICING_CONFIG from '../pricing.config.json';

/**
 * Returns currency info object (symbol, name, rate) for a given currency code.
 */
export const getCurrencyInfo = (currencyCode = 'NGN') => {
  return PRICING_CONFIG.currencies[currencyCode] || PRICING_CONFIG.currencies.NGN;
};

/**
 * Returns unit info object (name, symbol, factor) for a given unit code ('sqm' | 'sqft').
 */
export const getUnitInfo = (unitCode = 'sqm') => {
  return PRICING_CONFIG.units[unitCode] || PRICING_CONFIG.units.sqm;
};

/**
 * Converts a base NGN amount into the target currency.
 */
export const convertCurrency = (amountInNGN, targetCurrency = 'NGN') => {
  const info = getCurrencyInfo(targetCurrency);
  const val = (parseFloat(amountInNGN) || 0) * info.rate;
  return Math.round(val);
};

/**
 * Formats a monetary amount into a clean localized string with the currency symbol.
 */
export const formatCurrency = (amountInNGN, targetCurrency = 'NGN') => {
  const info = getCurrencyInfo(targetCurrency);
  const converted = convertCurrency(amountInNGN, targetCurrency);
  return `${info.symbol}${converted.toLocaleString()}`;
};

/**
 * Converts area between square metres (sqm) and square feet (sqft).
 */
export const convertArea = (areaInSqm, targetUnit = 'sqm') => {
  const unitInfo = getUnitInfo(targetUnit);
  return Math.round((parseFloat(areaInSqm) || 0) * unitInfo.factor);
};

/**
 * Converts area from a source unit back to base square metres (sqm).
 */
export const convertAreaToSqm = (area, sourceUnit = 'sqm') => {
  const unitInfo = getUnitInfo(sourceUnit);
  return Math.round((parseFloat(area) || 0) / unitInfo.factor);
};
