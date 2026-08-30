import { validateFieldRule } from '../hooks/useFormValidation';

describe('Form Validation Engine', () => {
  describe('projectType validation', () => {
    test('rejects empty projectType', () => {
      expect(validateFieldRule('projectType', '')).toBe('Please select a project type');
      expect(validateFieldRule('projectType', null)).toBe('Please select a project type');
    });

    test('accepts valid projectType', () => {
      expect(validateFieldRule('projectType', 'residential')).toBeNull();
      expect(validateFieldRule('projectType', 'commercial')).toBeNull();
      expect(validateFieldRule('projectType', 'industrial')).toBeNull();
    });
  });

  describe('location validation', () => {
    test('rejects empty or whitespace location', () => {
      expect(validateFieldRule('location', '')).toBe('Location is required');
      expect(validateFieldRule('location', '   ')).toBe('Location is required');
    });

    test('rejects location shorter than 2 characters', () => {
      expect(validateFieldRule('location', 'A')).toBe('Location must be at least 2 characters');
    });

    test('rejects location longer than 100 characters', () => {
      const longLocation = 'A'.repeat(101);
      expect(validateFieldRule('location', longLocation)).toBe('Location must be 100 characters or fewer');
    });

    test('accepts valid locations', () => {
      expect(validateFieldRule('location', 'Lagos, Nigeria')).toBeNull();
      expect(validateFieldRule('location', 'Abuja')).toBeNull();
    });
  });

  describe('buildingSize validation', () => {
    test('rejects non-numeric or <= 0 size', () => {
      expect(validateFieldRule('buildingSize', '0')).toBe('Building size must be greater than 0');
      expect(validateFieldRule('buildingSize', '-50')).toBe('Building size must be greater than 0');
      expect(validateFieldRule('buildingSize', 'abc')).toBe('Building size must be greater than 0');
    });

    test('rejects unrealistic building sizes > 100,000 sqm', () => {
      expect(validateFieldRule('buildingSize', '100001')).toBe('Building size seems unrealistic (max 100,000 sqm)');
    });

    test('accepts realistic building sizes', () => {
      expect(validateFieldRule('buildingSize', '250')).toBeNull();
      expect(validateFieldRule('buildingSize', 1500)).toBeNull();
    });
  });

  describe('floors validation', () => {
    test('rejects < 1 floor', () => {
      expect(validateFieldRule('floors', '0')).toBe('Must have at least 1 floor');
      expect(validateFieldRule('floors', '-1')).toBe('Must have at least 1 floor');
    });

    test('rejects > 100 floors', () => {
      expect(validateFieldRule('floors', '101')).toBe('Too many floors (max 100)');
    });

    test('accepts valid floor counts', () => {
      expect(validateFieldRule('floors', '1')).toBeNull();
      expect(validateFieldRule('floors', '4')).toBeNull();
    });
  });

  describe('budget validation', () => {
    test('rejects <= 0 budget', () => {
      expect(validateFieldRule('budget', '0')).toBe('Budget must be greater than 0');
      expect(validateFieldRule('budget', '-1000')).toBe('Budget must be greater than 0');
    });

    test('rejects budget > 10 billion', () => {
      expect(validateFieldRule('budget', '10000000001')).toMatch(/unrealistic/);
    });

    test('accepts valid budget', () => {
      expect(validateFieldRule('budget', '25000000')).toBeNull();
    });
  });

  describe('timeline validation', () => {
    test('rejects <= 0 timeline', () => {
      expect(validateFieldRule('timeline', '0')).toBe('Timeline must be greater than 0');
    });

    test('rejects timeline > 120 months', () => {
      expect(validateFieldRule('timeline', '121')).toMatch(/too long/);
    });

    test('accepts valid timelines', () => {
      expect(validateFieldRule('timeline', '12')).toBeNull();
      expect(validateFieldRule('timeline', '24')).toBeNull();
    });
  });
});
