/**
 * SitePilot Construction Pricing Engine
 * 
 * Logic derived from standard Nigerian quantity surveying heuristics and 2025 Market Prices.
 * Covers both STRUCTURE (Shell) and FINISHING phases.
 * Now uses projectType, budget, and timeline for accurate risk assessment.
 */

const PRICING_CONFIG = {
  materials: {
    // Structure
    cement: 9500, // per 50kg bag (High range for safety)
    block_9inch: 500, // per piece 
    steel_ton: 1400000, // per ton (High quality TMT)
    sand_ton: 6000, // per ton
    granite_ton: 10000, // per ton
    roofing_sqm: 7500, // Aluminium Longspan (0.55mm)

    // Finishing
    tiles_sqm: 6500, // Average for Vitrified/Ceramic mix
    pop_sqm: 8000, // Ceiling casting/boarding
    paint_drum: 35000, // Quality Emulsion (20L)
    door_internal: 60000, // HDF/Flush door complete
    door_security: 150000, // Steel security door
    window_sqm: 45000, // Aluminium Glazed
  },
  labor: {
    base_rate_sqm: 18000, // Blended rate for all trades
  },
  multipliers: {
    waste: 1.10, // 10% Waste factor
    mep_load: 0.18, // Mechanical/Electrical/Plumbing as 18% of total construction
    contingency_base: 0.10, // 10% Unforeseen
  },
  // Project type cost multipliers
  typeMultipliers: {
    residential: 1.0,
    commercial: 1.20,
    industrial: 1.10
  }
};

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
  const wallArea = totalFloorArea * 1.5; // Heuristic for walls
  const roofArea = Math.ceil(sqm * 1.4); // Roof is only on top floor area + pitch

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
  costs.aggregates = (sandTons * PRICING_CONFIG.materials.sand_ton) + 
                     (graniteTons * PRICING_CONFIG.materials.granite_ton);

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
  costs.doors = (internalDoors * PRICING_CONFIG.materials.door_internal) + 
                (securityDoors * PRICING_CONFIG.materials.door_security);

  // --- PHASE 3: SERVICES & LABOR ---

  const directCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const mepCost = Math.ceil(directCost * PRICING_CONFIG.multipliers.mep_load);
  const laborCost = Math.ceil(directCost * 0.25);

  // --- PHASE 4: CONTINGENCY (deterministic) ---
  const subTotal = directCost + mepCost + laborCost;
  
  // Deterministic variance based on project inputs (5-10%)
  const varianceSeed = ((sqm * 7 + numFloors * 13) % 100);
  const variancePct = 0.05 + (varianceSeed / 100) * 0.05;
  const contingencyCost = Math.ceil(subTotal * variancePct);

  const grandTotal = subTotal + contingencyCost;

  // --- RISK ASSESSMENT (now uses budget & timeline) ---
  
  // Budget risk
  let budgetRisk;
  if (budgetAmount > 0) {
    const diff = budgetAmount - grandTotal;
    const diffPercent = Math.round((diff / grandTotal) * 100);
    if (diff > 0) {
      budgetRisk = `Your budget of ₦${budgetAmount.toLocaleString()} is ₦${diff.toLocaleString()} above the estimated cost (${diffPercent}% surplus). Good buffer for unexpected costs.`;
    } else if (diff < 0) {
      budgetRisk = `Your budget of ₦${budgetAmount.toLocaleString()} is ₦${Math.abs(diff).toLocaleString()} below the estimated cost (${Math.abs(diffPercent)}% shortfall). Consider increasing budget or reducing scope.`;
    } else {
      budgetRisk = `Your budget matches the estimated cost exactly. Consider adding a 10-15% buffer.`;
    }
  } else {
    budgetRisk = 'No budget specified. Finishing materials (Tiles, POP) vary wildly by brand/quality.';
  }

  // Timeline risk
  let timelineRisk;
  const recommendedMonths = Math.ceil((totalFloorArea / 100) * 3 * (typeMultiplier > 1 ? 1.2 : 1));
  if (timelineMonths > 0) {
    if (timelineMonths < recommendedMonths * 0.7) {
      timelineRisk = `${timelineMonths} months is aggressive for ${totalFloorArea} sqm (${typeName}). Recommended: ${recommendedMonths}+ months. Rushing may compromise quality.`;
    } else if (timelineMonths > recommendedMonths * 1.5) {
      timelineRisk = `${timelineMonths} months is generous for ${totalFloorArea} sqm. This allows for thorough execution and quality control.`;
    } else {
      timelineRisk = `${timelineMonths} months is realistic for ${totalFloorArea} sqm. Recommended range: ${Math.ceil(recommendedMonths * 0.8)}-${Math.ceil(recommendedMonths * 1.3)} months.`;
    }
  } else {
    timelineRisk = 'No timeline specified. Imported finishes (Doors, Tiles) may face clearance delays.';
  }

  // Overall risk level
  const budgetDiffPercent = budgetAmount > 0 ? ((budgetAmount - grandTotal) / grandTotal) * 100 : 0;
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
    'Prices are for STANDARD quality finishes. Luxury specs will double costs.',
    'Professional supervision is assumed (avoiding quackery).',
    'MEP costs are estimates; specific design required for accuracy.'
  ];

  if (projectType === 'commercial') {
    warnings.push('Commercial projects require additional fire safety & accessibility compliance.');
  }
  if (projectType === 'industrial') {
    warnings.push('Industrial builds may need specialised foundations — consult a structural engineer.');
  }

  const recommendations = [
    'Buy cement in bulk to lock price.',
    'Supervise iron benders closely to avoid steel waste.',
    'Consider locally fabricated windows to save ~20%.'
  ];

  if (budgetAmount > 0 && budgetAmount < grandTotal) {
    recommendations.unshift(`Budget shortfall of ₦${(grandTotal - budgetAmount).toLocaleString()} — prioritise structure over finishes.`);
  }

  return {
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
      total: grandTotal
    },
    risk: {
      level: riskLevel,
      budgetRisk,
      timelineRisk
    },
    warnings,
    recommendations
  };
};
