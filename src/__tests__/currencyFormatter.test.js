import {
  getCurrencyInfo,
  getUnitInfo,
  convertCurrency,
  formatCurrency,
  convertArea,
  convertAreaToSqm
} from '../utils/currencyFormatter';

describe('SitePilot Currency & Unit Formatting Utilities', () => {
  describe('Currency conversions', () => {
    test('returns correct default currency info for NGN', () => {
      const info = getCurrencyInfo('NGN');
      expect(info.symbol).toBe('₦');
      expect(info.rate).toBe(1.0);
    });

    test('returns correct currency info for USD, GBP, EUR', () => {
      expect(getCurrencyInfo('USD').symbol).toBe('$');
      expect(getCurrencyInfo('GBP').symbol).toBe('£');
      expect(getCurrencyInfo('EUR').symbol).toBe('€');
    });

    test('falls back to NGN for unknown currency', () => {
      expect(getCurrencyInfo('XYZ').symbol).toBe('₦');
    });

    test('correctly converts and formats currency amounts', () => {
      const baseNGN = 10000000;
      const formattedNGN = formatCurrency(baseNGN, 'NGN');
      expect(formattedNGN).toBe('₦10,000,000');

      const convertedUSD = convertCurrency(baseNGN, 'USD');
      expect(convertedUSD).toBeGreaterThan(0);
      expect(formatCurrency(baseNGN, 'USD')).toContain('$');
    });
  });

  describe('Area Unit conversions', () => {
    test('returns correct default sqm unit info', () => {
      const info = getUnitInfo('sqm');
      expect(info.symbol).toBe('sqm');
      expect(info.factor).toBe(1.0);
    });

    test('returns correct sqft factor', () => {
      const info = getUnitInfo('sqft');
      expect(info.symbol).toBe('sq ft');
      expect(info.factor).toBeCloseTo(10.7639, 2);
    });

    test('converts 100 sqm to ~1076 sqft', () => {
      const sqft = convertArea(100, 'sqft');
      expect(sqft).toBe(1076);
    });

    test('converts 1076 sqft back to 100 sqm', () => {
      const sqm = convertAreaToSqm(1076, 'sqft');
      expect(sqm).toBe(100);
    });
  });
});
