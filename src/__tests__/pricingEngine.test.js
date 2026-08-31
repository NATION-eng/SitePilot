import { calculateConstructionCosts } from '../utils/pricingEngine';
import PRICING_CONFIG from '../pricing.config.json';

describe('SitePilot Construction Pricing Engine', () => {
  const sampleResidential = {
    buildingSize: '200',
    floors: '2',
    projectType: 'residential',
    budget: '50000000',
    timeline: '12',
    notes: 'Test project',
    specTier: 'standard',
    flooringType: 'ceramic',
    roofingType: 'aluminium',
    ceilingType: 'pop',
    foundationType: 'strip',
    selectedAddons: []
  };

  test('returns null if buildingSize is missing or 0', () => {
    expect(calculateConstructionCosts({ buildingSize: '0', floors: '1' })).toBeNull();
    expect(calculateConstructionCosts({ buildingSize: '', floors: '1' })).toBeNull();
  });

  test('calculates correct structure and finishing quantities for residential build', () => {
    const result = calculateConstructionCosts(sampleResidential);
    expect(result).toBeDefined();
    expect(result.materials).toHaveProperty('cement');
    expect(result.materials).toHaveProperty('blocks');
    expect(result.materials).toHaveProperty('steel');
    expect(result.materials).toHaveProperty('sand');
    expect(result.materials).toHaveProperty('granite');
    expect(result.materials).toHaveProperty('roofing');
    expect(result.materials).toHaveProperty('tiles');
    expect(result.materials).toHaveProperty('pop');
    expect(result.materials).toHaveProperty('paint');
    expect(result.materials).toHaveProperty('windows');
    expect(result.materials).toHaveProperty('doors');
  });

  test('includes all mandatory cost categories and total', () => {
    const result = calculateConstructionCosts(sampleResidential);
    const costs = result.costs;

    expect(costs.cement).toBeGreaterThan(0);
    expect(costs.blocks).toBeGreaterThan(0);
    expect(costs.steel).toBeGreaterThan(0);
    expect(costs.aggregates).toBeGreaterThan(0);
    expect(costs.roofing).toBeGreaterThan(0);
    expect(costs.tiles).toBeGreaterThan(0);
    expect(costs.pop).toBeGreaterThan(0);
    expect(costs.paint).toBeGreaterThan(0);
    expect(costs.windows).toBeGreaterThan(0);
    expect(costs.doors).toBeGreaterThan(0);
    expect(costs.m_e_p).toBeGreaterThan(0);
    expect(costs.labor).toBeGreaterThan(0);
    expect(costs.contingency).toBeGreaterThan(0);
    expect(costs.total).toBeGreaterThan(0);

    // Verify grand total equals subtotal + contingency
    const directSum =
      costs.cement +
      costs.blocks +
      costs.steel +
      costs.aggregates +
      costs.roofing +
      costs.tiles +
      costs.pop +
      costs.paint +
      costs.windows +
      costs.doors;
    const expectedSubtotal = directSum + costs.m_e_p + costs.labor + (costs.addons || 0);
    expect(costs.total).toBe(expectedSubtotal + costs.contingency);
  });

  test('applies specification tier multiplier for Luxury vs Standard', () => {
    const standardResult = calculateConstructionCosts({ ...sampleResidential, specTier: 'standard' });
    const luxuryResult = calculateConstructionCosts({ ...sampleResidential, specTier: 'luxury' });

    expect(luxuryResult.costs.windows).toBeGreaterThan(standardResult.costs.windows);
    expect(luxuryResult.costs.doors).toBeGreaterThan(standardResult.costs.doors);
    expect(luxuryResult.costs.total).toBeGreaterThan(standardResult.costs.total);
  });

  test('adjusts cost for Raft foundation soil condition vs Strip footing', () => {
    const stripResult = calculateConstructionCosts({ ...sampleResidential, foundationType: 'strip' });
    const raftResult = calculateConstructionCosts({ ...sampleResidential, foundationType: 'raft' });

    expect(raftResult.costs.cement).toBeGreaterThan(stripResult.costs.cement);
    expect(raftResult.costs.steel).toBeGreaterThan(stripResult.costs.steel);
    expect(raftResult.costs.total).toBeGreaterThan(stripResult.costs.total);
  });

  test('incorporates engineering infrastructure add-ons (solar, borehole)', () => {
    const withoutAddons = calculateConstructionCosts({ ...sampleResidential, selectedAddons: [] });
    const withAddons = calculateConstructionCosts({ ...sampleResidential, selectedAddons: ['solar', 'borehole'] });

    expect(withAddons.addons.length).toBe(2);
    expect(withAddons.totalAddonsCost).toBe(PRICING_CONFIG.engineeringAddons.solar.cost + PRICING_CONFIG.engineeringAddons.borehole.cost);
    expect(withAddons.costs.total).toBeGreaterThan(withoutAddons.costs.total);
  });

  test('applies commercial type multiplier (1.20x) properly', () => {
    const resResult = calculateConstructionCosts({ ...sampleResidential, projectType: 'residential' });
    const commResult = calculateConstructionCosts({ ...sampleResidential, projectType: 'commercial' });

    expect(commResult.costs.cement).toBeGreaterThan(resResult.costs.cement);
    expect(commResult.costs.blocks).toBeGreaterThan(resResult.costs.blocks);
    expect(commResult.costs.total).toBeGreaterThan(resResult.costs.total);
  });

  test('applies industrial structural steel multiplier properly', () => {
    const resResult = calculateConstructionCosts({ ...sampleResidential, projectType: 'residential' });
    const indResult = calculateConstructionCosts({ ...sampleResidential, projectType: 'industrial' });

    expect(indResult.costs.steel).toBeGreaterThan(resResult.costs.steel);
  });

  test('correctly evaluates budget surplus and shortfall', () => {
    const lowBudget = calculateConstructionCosts({ ...sampleResidential, budget: '5000000' });
    expect(lowBudget.risk.budgetRisk).toMatch(/shortfall/i);

    const highBudget = calculateConstructionCosts({ ...sampleResidential, budget: '200000000' });
    expect(highBudget.risk.budgetRisk).toMatch(/surplus/i);
  });

  test('correctly assesses aggressive timeline risks', () => {
    const tightTimeline = calculateConstructionCosts({ ...sampleResidential, timeline: '2' });
    expect(tightTimeline.risk.timelineRisk).toMatch(/aggressive/i);
  });

  test('exposes pricesLastUpdated date matching config', () => {
    const result = calculateConstructionCosts(sampleResidential);
    expect(result.pricesLastUpdated).toBe(PRICING_CONFIG._meta.lastUpdated);
  });
});
