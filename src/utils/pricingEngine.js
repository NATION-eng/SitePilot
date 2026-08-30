/**
 * SitePilot Construction Pricing Engine
 *
 * Logic derived from standard Nigerian quantity surveying heuristics.
 * Covers both STRUCTURE (Shell) and FINISHING phases.
 * Uses projectType, budget, and timeline for accurate risk assessment.
 *
 * ⚠️  DO NOT hardcode prices here. Update src/pricing.config.json instead.
 */

import PRICING_CONFIG from '../pricing.config.json';

/**
 * Calculates full construction cost estimate for a given project.
 * @param {Object} projectData - The form data collected from the user.
 * @returns {Object|null} Analysis results or null if buildingSize is 0.
 */
export const calculateConstructionCosts = (projectData) => {
  const { buildingSize, floors, projectType, budget, timeline } = projectData;

  // 1. Validate and Parse Inputs
  const sqm = parseFloat(buildingSize) || 0;
  const numFloors = parseFloat(floors) || 1;
  const budgetAmount = parseFloat(budget) || 0;
  const timelineMonths = parseFloat(timeline) || 0;

  if (sqm === 0) return null;

  // 2. Get type multiplier
  const typeMultiplier = PRICING_CONFIG.typeMultipliers[projectType] || 1.0;
  const typeName = projectType
    ? projectType.charAt(0).toUpperCase() + projectType.slice(1)
    : 'General';

  // 3. Calculate Core Metrics
  const totalFloorArea = sqm * numFloors;
  const wallArea = totalFloorArea * 1.5;         // Heuristic for walls
  const roofArea = Math.ceil(sqm * 1.4);          // Roof pitch factor — top floor only

  const quantities = {};
  const costs = {};

  // --- PHASE 1: STRUCTURE ---

  // Cement (Structure + Plaster + Floor Bed)
  const cementBags = Math.ceil(totalFloorArea * 4.2);
  quantities.cement = `${cementBags.toLocaleString()} bags`;
  costs.cement = Math.ceil(cementBags * PRICING_CONFIG.materials.cement * typeMultiplier);

  // Blocks
  const blockCount = Math.ceil(wallArea * 10);
  quantities.blocks = `${blockCount.toLocaleString()} pieces (9")`;
  costs.blocks = Math.ceil(blockCount * PRICING_CONFIG.materials.block_9inch * typeMultiplier);

  // Steel
  let steelKgPerSqm = numFloors > 1 ? 25 : 10;
  if (projectType === 'industrial') steelKgPerSqm *= 1.15; // Heavier structure
  const steelTons = (totalFloorArea * steelKgPerSqm) / 1000;
  quantities.steel = `${steelTons.toFixed(1)} tons`;
  costs.steel = Math.ceil(steelTons * PRICING_CONFIG.materials.steel_ton);

  // Aggregates
  const sandTons = Math.ceil(cementBags * 0.15);
  const graniteTons = Math.ceil(cementBags * 0.20);
  quantities.sand = `${sandTons} tons`;
  quantities.granite = `${graniteTons} tons`;
  costs.aggregates =
    sandTons * PRICING_CONFIG.materials.sand_ton +
    graniteTons * PRICING_CONFIG.materials.granite_ton;

  // Roofing
  quantities.roofing = `${roofArea} sqm`;
  costs.roofing = roofArea * PRICING_CONFIG.materials.roofing_sqm;

  // --- PHASE 2: FINISHING ---

  // Tiles
  const tileArea = Math.ceil(totalFloorArea * 1.25);
  quantities.tiles = `${tileArea} sqm`;
  costs.tiles = Math.ceil(tileArea * PRICING_CONFIG.materials.tiles_sqm * typeMultiplier);

  // POP Ceiling
  const popArea = Math.ceil(totalFloorArea);
  quantities.pop = `${popArea} sqm`;
  costs.pop = Math.ceil(popArea * PRICING_CONFIG.materials.pop_sqm * typeMultiplier);

  // Paint
  const paintDrums = Math.ceil((wallArea * 2.2) / 30);
  quantities.paint = `${paintDrums} drums`;
  costs.paint = paintDrums * PRICING_CONFIG.materials.paint_drum;

  // Windows
  const windowArea = Math.ceil(wallArea * 0.15);
  quantities.windows = `${windowArea} sqm`;
  costs.windows = Math.ceil(windowArea * PRICING_CONFIG.materials.window_sqm * typeMultiplier);

  // Doors
  const internalDoors = Math.ceil(totalFloorArea / 15);
  const securityDoors = 2 * numFloors;
  quantities.doors = `${internalDoors} Internal, ${securityDoors} Security`;
  costs.doors =
    internalDoors * PRICING_CONFIG.materials.door_internal +
    securityDoors * PRICING_CONFIG.materials.door_security;

  // --- PHASE 3: SERVICES & LABOUR ---

  const directCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const mepCost = Math.ceil(directCost * PRICING_CONFIG.multipliers.mep_load);
  const laborCost = Math.ceil(directCost * 0.25);

  // --- PHASE 4: CONTINGENCY (deterministic) ---

  const subTotal = directCost + mepCost + laborCost;

  // Deterministic variance based on project dimensions (5–10%)
  const varianceSeed = (sqm * 7 + numFloors * 13) % 100;
  const variancePct = 0.05 + (varianceSeed / 100) * 0.05;
  const contingencyCost = Math.ceil(subTotal * variancePct);

  const grandTotal = subTotal + contingencyCost;

  // --- RISK ASSESSMENT ---

  // Budget calculations
  const budgetDiff = budgetAmount > 0 ? budgetAmount - grandTotal : 0;
  const budgetDiffPercent = grandTotal > 0 ? Math.round((budgetDiff / grandTotal) * 100) : 0;
  let budgetRisk;

  if (budgetAmount > 0) {
    if (budgetDiff > 0) {
      budgetRisk = `Your budget is ₦${budgetDiff.toLocaleString()} above the estimated cost (${budgetDiffPercent}% surplus). Good buffer for unexpected expenses.`;
    } else if (budgetDiff < 0) {
      budgetRisk = `Your budget is ₦${Math.abs(budgetDiff).toLocaleString()} below the estimated cost (${Math.abs(budgetDiffPercent)}% shortfall). Consider increasing budget or reducing scope.`;
    } else {
      budgetRisk = `Your budget matches the estimated cost exactly. Consider adding a 10–15% contingency buffer.`;
    }
  } else {
    budgetRisk = 'No budget specified. Finishing materials (Tiles, POP, Fittings) vary significantly by brand and grade.';
  }

  // Timeline risk
  let timelineRisk;
  const recommendedMonths = Math.ceil(
    (totalFloorArea / 100) * 3 * (typeMultiplier > 1 ? 1.2 : 1)
  );
  if (timelineMonths > 0) {
    if (timelineMonths < recommendedMonths * 0.7) {
      timelineRisk = `${timelineMonths} months is aggressive for ${totalFloorArea} sqm (${typeName}). Recommended: ${recommendedMonths}+ months. Rushing construction may compromise structural curing.`;
    } else if (timelineMonths > recommendedMonths * 1.5) {
      timelineRisk = `${timelineMonths} months is generous for ${totalFloorArea} sqm. This allows for thorough execution and quality control.`;
    } else {
      timelineRisk = `${timelineMonths} months is realistic for ${totalFloorArea} sqm. Recommended range: ${Math.ceil(recommendedMonths * 0.8)}–${Math.ceil(recommendedMonths * 1.3)} months.`;
    }
  } else {
    timelineRisk = 'No timeline specified. Standard allowance is 6–12 months depending on finishes procurement.';
  }

  // Overall risk level
  let riskLevel;
  if (grandTotal > 50000000 || budgetDiffPercent < -20) {
    riskLevel = 'High';
  } else if (budgetDiffPercent < -5 || grandTotal > 30000000) {
    riskLevel = 'Medium';
  } else {
    riskLevel = budgetAmount > 0 ? 'Low' : 'Medium';
  }

  // --- WARNINGS & RECOMMENDATIONS ---

  const warnings = [
    'Prices are for STANDARD quality finishes. Luxury specifications will increase costs.',
    'Professional structural engineering supervision is assumed.',
    'MEP costs are estimates based on standard loads; specific engineering designs required for tender.',
  ];

  if (projectType === 'commercial') {
    warnings.push('Commercial projects require additional fire safety & accessibility compliance provisions.');
  }
  if (projectType === 'industrial') {
    warnings.push('Industrial builds may need specialized foundation piling — consult a geotechnical engineer.');
  }

  const recommendations = [
    'Procure cement and steel in bulk batches to hedge against market price volatility.',
    'Supervise rebar cutting and bending closely on site to keep steel waste below 5%.',
    'Consider factory-direct aluminium glazed windows to save up to 20% on fenestration costs.',
  ];

  const shortfallAmount = budgetAmount > 0 && budgetAmount < grandTotal ? (grandTotal - budgetAmount) : 0;

  return {
    pricesLastUpdated: PRICING_CONFIG._meta.lastUpdated,
    materials: quantities,
    costs: {
      cement: costs.cement,
      blocks: costs.blocks,
      steel: costs.steel,
      aggregates: costs.aggregates,
      roofing: costs.roofing,
      tiles: costs.tiles,
      pop: costs.pop,
      paint: costs.paint,
      windows: costs.windows,
      doors: costs.doors,
      m_e_p: mepCost,
      labor: laborCost,
      contingency: contingencyCost,
      total: grandTotal,
    },
    risk: {
      level: riskLevel,
      budgetAmount,
      grandTotal,
      budgetDiff,
      budgetDiffPercent,
      budgetRisk,
      timelineRisk,
    },
    shortfallAmount,
    warnings,
    recommendations,
  };
};
