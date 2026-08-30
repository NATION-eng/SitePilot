import { generateBOQCSV } from '../utils/csvExport';

describe('SitePilot BOQ CSV Export Utility', () => {
  const sampleProject = {
    projectType: 'residential',
    location: 'Lekki, Lagos',
    buildingSize: '300',
    floors: '2',
    budget: '60000000',
    timeline: '14',
    notes: 'Premium finish requested, high water table area'
  };

  const sampleAnalysis = {
    pricesLastUpdated: '2026-08-28',
    materials: {
      cement: '2,520 bags',
      blocks: '9,000 pieces (9")',
      steel: '15.0 tons',
      sand: '378 tons',
      granite: '504 tons',
      roofing: '420 sqm',
      tiles: '750 sqm',
      pop: '600 sqm',
      paint: '44 drums',
      windows: '90 sqm',
      doors: '40 Internal, 4 Security'
    },
    costs: {
      cement: 23940000,
      blocks: 4500000,
      steel: 21000000,
      aggregates: 7308000,
      roofing: 3150000,
      tiles: 4875000,
      pop: 4800000,
      paint: 1540000,
      windows: 4050000,
      doors: 3000000,
      m_e_p: 13529340,
      labor: 18790750,
      contingency: 5374155,
      total: 115857245
    },
    risk: {
      level: 'High',
      budgetRisk: 'Budget shortfall of ₦55,857,245.',
      timelineRisk: '14 months is realistic.'
    },
    warnings: ['Prices are for standard finishes.'],
    recommendations: ['Buy cement in bulk.']
  };

  test('returns empty string if missing data', () => {
    expect(generateBOQCSV(null, null)).toBe('');
    expect(generateBOQCSV({}, {})).toBe('');
  });

  test('generates valid CSV starting with UTF-8 BOM in base NGN', () => {
    const csv = generateBOQCSV(sampleProject, sampleAnalysis, 'NGN');
    expect(csv.startsWith('\uFEFF')).toBe(true);
    expect(csv).toContain('SITEPILOT - PRE-CONSTRUCTION BILL OF QUANTITIES (BOQ)');
    expect(csv).toContain('PHASE 1: SUBSTRUCTURE & SUPERSTRUCTURE');
    expect(csv).toContain('PHASE 2: FINISHING & ARCHITECTURAL FITTINGS');
    expect(csv).toContain('PHASE 3: SERVICES & TRADE LABOUR');
    expect(csv).toContain('PHASE 4: CONTINGENCY & GRAND TOTAL');
    expect(csv).toContain('Lekki, Lagos');
    expect(csv).toContain('115857245');
  });

  test('properly escapes commas and quotes in project notes', () => {
    const csv = generateBOQCSV(sampleProject, sampleAnalysis, 'NGN');
    expect(csv).toContain('"Premium finish requested, high water table area"');
  });

  test('converts cost numbers when exporting in USD', () => {
    const csvUSD = generateBOQCSV(sampleProject, sampleAnalysis, 'USD');
    expect(csvUSD).toContain('ESTIMATED COST (USD)');
    // 115,857,245 * 0.000645 = ~74728
    expect(csvUSD).toContain('74728');
  });
});
