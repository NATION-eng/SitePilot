import { calculateConstructionCosts } from '../utils/pricingEngine';
import PRICING_CONFIG from '../pricing.config.json';

describe('SitePilot Multi-Project Portfolio & Regional Indices', () => {
  const sampleLekkiProject = {
    projectType: 'residential',
    regionKey: 'lagos_island',
    location: 'Lekki Phase 1, Lagos',
    buildingSize: '300',
    floors: '2',
    budget: '70000000',
    timeline: '12',
    specTier: 'premium',
    flooringType: 'vitrified',
    roofingType: 'stone_coated',
    ceilingType: 'gypsum',
    foundationType: 'raft',
    selectedAddons: ['borehole', 'solar'],
    customMaterials: [
      { name: 'Imported Marble Slabs', unit: 'sqm', quantity: '40', unitPrice: '25000' }
    ]
  };

  test('applies regional cost indices correctly across different Nigerian states', () => {
    const islandResult = calculateConstructionCosts({ ...sampleLekkiProject, regionKey: 'lagos_island' });
    const ogunResult = calculateConstructionCosts({ ...sampleLekkiProject, regionKey: 'ogun_oyo' });
    const kanoResult = calculateConstructionCosts({ ...sampleLekkiProject, regionKey: 'kano_kaduna' });

    expect(islandResult.region.multiplier).toBe(1.25);
    expect(ogunResult.region.multiplier).toBe(0.98);
    expect(kanoResult.region.multiplier).toBe(0.95);

    // Island costs should exceed Inland costs due to water table & logistics
    expect(islandResult.costs.cement).toBeGreaterThan(ogunResult.costs.cement);
    expect(islandResult.costs.steel).toBeGreaterThan(kanoResult.costs.steel);
    expect(islandResult.costs.total).toBeGreaterThan(ogunResult.costs.total);
  });

  test('generates a 6-stage milestone cashflow disbursement schedule matching 100% of grand total', () => {
    const result = calculateConstructionCosts(sampleLekkiProject);

    expect(result.milestones).toHaveLength(6);

    const totalPercent = result.milestones.reduce((acc, m) => acc + m.percent, 0);
    expect(totalPercent).toBe(100);

    const totalMilestoneCost = result.milestones.reduce((acc, m) => acc + m.amount, 0);
    // Sum of rounded milestone allocations should be within 0.1% of grand total
    const diff = Math.abs(totalMilestoneCost - result.costs.total);
    expect(diff / result.costs.total).toBeLessThan(0.01);
  });

  test('computes all 4 market inflation stress-test scenarios with correct variances', () => {
    const result = calculateConstructionCosts(sampleLekkiProject);

    expect(result.stressTests).toHaveProperty('optimistic');
    expect(result.stressTests).toHaveProperty('base');
    expect(result.stressTests).toHaveProperty('moderate_inflation');
    expect(result.stressTests).toHaveProperty('severe_surge');

    expect(result.stressTests.optimistic.totalCost).toBeLessThan(result.stressTests.base.totalCost);
    expect(result.stressTests.moderate_inflation.totalCost).toBeGreaterThan(result.stressTests.base.totalCost);
    expect(result.stressTests.severe_surge.totalCost).toBeGreaterThan(result.stressTests.moderate_inflation.totalCost);
  });
});
