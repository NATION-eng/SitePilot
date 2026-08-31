/**
 * SitePilot Construction Pricing Engine
 *
 * Logic derived from standard Nigerian quantity surveying heuristics.
 * Covers both STRUCTURE (Shell) and FINISHING phases.
 * Fully supports engineer material specs, finish quality tiers, foundation soil adjustments, and engineering add-ons.
 */

import PRICING_CONFIG from '../pricing.config.json';

/**
 * Calculates full construction cost estimate for a given project.
 * @param {Object} projectData - The form data collected from the user.
 * @param {Object|null} customPrices - Optional custom material unit price overrides.
 * @returns {Object|null} Analysis results or null if buildingSize is 0.
 */
export const calculateConstructionCosts = (projectData, customPrices = null) => {
  const {
    buildingSize,
    floors,
    projectType,
    budget,
    timeline,
    specTier = 'standard',
    flooringType = 'ceramic',
    roofingType = 'aluminium',
    ceilingType = 'pop',
    foundationType = 'strip',
    selectedAddons = []
  } = projectData;

  // 1. Validate and Parse Inputs
  const sqm = parseFloat(buildingSize) || 0;
  const numFloors = parseFloat(floors) || 1;
  const budgetAmount = parseFloat(budget) || 0;
  const timelineMonths = parseFloat(timeline) || 0;

  if (sqm === 0) return null;

  // Active material rates (custom overrides or baseline config)
  const mat = { ...PRICING_CONFIG.materials, ...(customPrices || {}) };

  // Spec Tier Multiplier (Standard: 1.0, Premium: 1.35, Luxury: 1.85)
  const tierConfig = PRICING_CONFIG.specTiers[specTier] || PRICING_CONFIG.specTiers.standard;
  const specMultiplier = tierConfig.multiplier || 1.0;

  // Foundation Substructure Multiplier (Strip: 1.0, Raft: 1.40, Piled: 2.10)
  const foundationConfig =
    PRICING_CONFIG.materialOptions.foundation[foundationType] ||
    PRICING_CONFIG.materialOptions.foundation.strip;
  const foundationMultiplier = foundationConfig.multiplier || 1.0;

  // Proportional scaling for specific material overrides based on user custom price adjustments
  const flooringConfig =
    PRICING_CONFIG.materialOptions.flooring[flooringType] ||
    PRICING_CONFIG.materialOptions.flooring.ceramic;
  const flooringScale = (mat.tiles_sqm || PRICING_CONFIG.materials.tiles_sqm) / PRICING_CONFIG.materials.tiles_sqm;
  const activeFlooringRate = Math.round(flooringConfig.rate * flooringScale);

  const roofingConfig =
    PRICING_CONFIG.materialOptions.roofing[roofingType] ||
    PRICING_CONFIG.materialOptions.roofing.aluminium;
  const roofingScale = (mat.roofing_sqm || PRICING_CONFIG.materials.roofing_sqm) / PRICING_CONFIG.materials.roofing_sqm;
  const activeRoofingRate = Math.round(roofingConfig.rate * roofingScale);

  const ceilingConfig =
    PRICING_CONFIG.materialOptions.ceiling[ceilingType] ||
    PRICING_CONFIG.materialOptions.ceiling.pop;
  const ceilingScale = (mat.pop_sqm || PRICING_CONFIG.materials.pop_sqm) / PRICING_CONFIG.materials.pop_sqm;
  const activeCeilingRate = Math.round(ceilingConfig.rate * ceilingScale);

  // Type Multiplier (Residential: 1.0, Commercial: 1.20, Industrial: 1.10)
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

  // --- PHASE 1: STRUCTURE (Adjusted by Foundation Type) ---

  // Cement (Structure + Plaster + Floor Bed)
  const cementBags = Math.ceil(totalFloorArea * 4.2 * (foundationMultiplier > 1 ? 1 + (foundationMultiplier - 1) * 0.35 : 1));
  quantities.cement = `${cementBags.toLocaleString()} bags`;
  costs.cement = Math.ceil(cementBags * (mat.cement || PRICING_CONFIG.materials.cement) * typeMultiplier);

  // Blocks
  const blockCount = Math.ceil(wallArea * 10);
  quantities.blocks = `${blockCount.toLocaleString()} pieces (9")`;
  costs.blocks = Math.ceil(blockCount * (mat.block_9inch || PRICING_CONFIG.materials.block_9inch) * typeMultiplier);

  // Steel (Structure + Foundation load)
  let steelKgPerSqm = numFloors > 1 ? 25 : 10;
  if (projectType === 'industrial') steelKgPerSqm *= 1.15;
  if (foundationMultiplier > 1) steelKgPerSqm *= (1 + (foundationMultiplier - 1) * 0.45); // Heavy rebar in raft/pile

  const steelTons = (totalFloorArea * steelKgPerSqm) / 1000;
  quantities.steel = `${steelTons.toFixed(1)} tons`;
  costs.steel = Math.ceil(steelTons * (mat.steel_ton || PRICING_CONFIG.materials.steel_ton));

  // Aggregates
  const sandTons = Math.ceil(cementBags * 0.15);
  const graniteTons = Math.ceil(cementBags * 0.20);
  quantities.sand = `${sandTons} tons`;
  quantities.granite = `${graniteTons} tons`;
  costs.aggregates =
    sandTons * (mat.sand_ton || PRICING_CONFIG.materials.sand_ton) +
    graniteTons * (mat.granite_ton || PRICING_CONFIG.materials.granite_ton);

  // Roofing
  quantities.roofing = `${roofArea} sqm (${roofingConfig.name.split(' ')[0]})`;
  costs.roofing = Math.ceil(roofArea * activeRoofingRate);

  // --- PHASE 2: FINISHING (Adjusted by Spec Tier & Specific Options) ---

  // Tiles / Flooring
  const tileArea = Math.ceil(totalFloorArea * 1.25);
  quantities.tiles = `${tileArea} sqm (${flooringConfig.name.split(' ')[0]})`;
  costs.tiles = Math.ceil(tileArea * activeFlooringRate * typeMultiplier);

  // POP / Ceiling
  const popArea = Math.ceil(totalFloorArea);
  quantities.pop = `${popArea} sqm (${ceilingConfig.name.split(' ')[0]})`;
  costs.pop = Math.ceil(popArea * activeCeilingRate * typeMultiplier);

  // Paint
  const paintDrums = Math.ceil((wallArea * 2.2) / 30);
  quantities.paint = `${paintDrums} drums`;
  costs.paint = Math.ceil(paintDrums * (mat.paint_drum || PRICING_CONFIG.materials.paint_drum) * (specTier === 'luxury' ? 1.4 : specTier === 'premium' ? 1.2 : 1.0));

  // Windows
  const windowArea = Math.ceil(wallArea * 0.15);
  quantities.windows = `${windowArea} sqm`;
  costs.windows = Math.ceil(windowArea * (mat.window_sqm || PRICING_CONFIG.materials.window_sqm) * typeMultiplier * specMultiplier);

  // Doors
  const internalDoors = Math.ceil(totalFloorArea / 15);
  const securityDoors = 2 * numFloors;
  quantities.doors = `${internalDoors} Internal, ${securityDoors} Security`;
  costs.doors = Math.ceil((
    internalDoors * (mat.door_internal || PRICING_CONFIG.materials.door_internal) +
    securityDoors * (mat.door_security || PRICING_CONFIG.materials.door_security)
  ) * specMultiplier);

  // --- PHASE 3: SERVICES & LABOUR ---

  const directBaseCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const mepCost = Math.ceil(directBaseCost * PRICING_CONFIG.multipliers.mep_load);
  const laborCost = Math.ceil(directBaseCost * 0.25);

  // --- PHASE 4: ENGINEERING ADD-ONS ---
  const addonsSummary = [];
  let totalAddonsCost = 0;

  if (Array.isArray(selectedAddons) && selectedAddons.length > 0) {
    selectedAddons.forEach((addonKey) => {
      const addonMeta = PRICING_CONFIG.engineeringAddons[addonKey];
      if (addonMeta) {
        addonsSummary.push({
          key: addonKey,
          name: addonMeta.name,
          cost: addonMeta.cost,
          category: addonMeta.category,
          icon: addonMeta.icon
        });
        totalAddonsCost += addonMeta.cost;
      }
    });
  }

  // --- PHASE 5: CONTINGENCY & GRAND TOTAL ---

  const subTotal = directBaseCost + mepCost + laborCost + totalAddonsCost;

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
      budgetRisk = `Your budget is ₦${budgetDiff.toLocaleString()} above the estimated cost (${budgetDiffPercent}% surplus). Good buffer for unexpected project expenses.`;
    } else if (budgetDiff < 0) {
      budgetRisk = `Your budget is ₦${Math.abs(budgetDiff).toLocaleString()} below the estimated cost (${Math.abs(budgetDiffPercent)}% shortfall). Consider phasing interior finishes or selecting standard grade specifications.`;
    } else {
      budgetRisk = `Your budget matches the estimated cost exactly. Consider adding a 10–15% contingency buffer.`;
    }
  } else {
    budgetRisk = `No budget specified. Selected ${tierConfig.name} finishes will be key cost drivers.`;
  }

  // Timeline risk
  let timelineRisk;
  const recommendedMonths = Math.ceil(
    (totalFloorArea / 100) * 3 * (typeMultiplier > 1 ? 1.2 : 1) * (specTier === 'luxury' ? 1.25 : 1.0)
  );
  if (timelineMonths > 0) {
    if (timelineMonths < recommendedMonths * 0.7) {
      timelineRisk = `${timelineMonths} months is aggressive for ${totalFloorArea} sqm (${typeName}, ${tierConfig.name}). Recommended: ${recommendedMonths}+ months.`;
    } else if (timelineMonths > recommendedMonths * 1.5) {
      timelineRisk = `${timelineMonths} months is generous for ${totalFloorArea} sqm. This allows for thorough quality control.`;
    } else {
      timelineRisk = `${timelineMonths} months is realistic for ${totalFloorArea} sqm. Recommended range: ${Math.ceil(recommendedMonths * 0.8)}–${Math.ceil(recommendedMonths * 1.3)} months.`;
    }
  } else {
    timelineRisk = `No timeline specified. Standard allowance for ${tierConfig.name} build is ${recommendedMonths} months.`;
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
    `Pricing calibrated for ${tierConfig.name} specification grade.`,
    `Foundation estimated for ${foundationConfig.name}. Consult geotechnical soil test before casting.`,
    'MEP costs are estimates based on standard loads; specific engineering designs required for tender.',
  ];

  if (projectType === 'commercial') {
    warnings.push('Commercial projects require additional fire safety & accessibility compliance provisions.');
  }
  if (projectType === 'industrial') {
    warnings.push('Industrial builds may need specialized foundation piling — consult a geotechnical engineer.');
  }

  const recommendations = [
    `Lock material orders early for ${flooringConfig.name} and ${roofingConfig.name} to avoid shipment delays.`,
    'Supervise rebar cutting and bending closely on site to keep steel waste below 5%.',
    'Ensure stage-by-stage quantity surveying verification before contractor disbursements.',
  ];

  if (totalAddonsCost > 0) {
    recommendations.push(`Ancillary engineering works total ₦${totalAddonsCost.toLocaleString()} across ${addonsSummary.length} add-ons.`);
  }

  const shortfallAmount = budgetAmount > 0 && budgetAmount < grandTotal ? (grandTotal - budgetAmount) : 0;

  return {
    pricesLastUpdated: PRICING_CONFIG._meta.lastUpdated,
    specifications: {
      specTier,
      specTierName: tierConfig.name,
      flooringName: flooringConfig.name,
      roofingName: roofingConfig.name,
      ceilingName: ceilingConfig.name,
      foundationName: foundationConfig.name
    },
    addons: addonsSummary,
    totalAddonsCost,
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
      addons: totalAddonsCost,
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
