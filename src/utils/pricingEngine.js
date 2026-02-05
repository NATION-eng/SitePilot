/**
 * SitePilot Construction Pricing Engine
 * 
 * Logic derived from standard Nigerian quantity surveying heuristics and 2025 Market Prices.
 * Covers both STRUCTURE (Shell) and FINISHING phases.
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
  }
};

export const calculateConstructionCosts = (projectData) => {
  const { buildingSize, floors, location, projectType } = projectData;

  // 1. Validate and Parse Inputs
  const sqm = parseFloat(buildingSize) || 0;
  const numFloors = parseFloat(floors) || 1;
  
  if (sqm === 0) return null;

  // 2. Calculate Core Metrics
  const totalFloorArea = sqm * numFloors; 
  const wallArea = totalFloorArea * 1.5; // Heuristic for walls
  const roofArea = Math.ceil(sqm * 1.4); // Roof is only on top floor area + pitch

  const quantities = {};
  const costs = {};

  // --- PHASE 1: STRUCTURE ---

  // Cement (Structure + Plaster + Floor Bed)
  // ~4 bags/sqm is valid for the shell.
  const cementBags = Math.ceil(totalFloorArea * 4.2); // Slight bump for contingencies
  quantities.cement = `${cementBags.toLocaleString()} bags`;
  costs.cement = cementBags * PRICING_CONFIG.materials.cement;

  // Blocks
  const blockCount = Math.ceil(wallArea * 10);
  quantities.blocks = `${blockCount.toLocaleString()} pieces (9")`;
  costs.blocks = blockCount * PRICING_CONFIG.materials.block_9inch;

  // Steel
  let steelKgPerSqm = numFloors > 1 ? 25 : 10; // Higher steel for multi-story
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

  // Tiles (Floor Area + ~20% for Skirting/Waste/Bath walls)
  const tileArea = Math.ceil(totalFloorArea * 1.25);
  quantities.tiles = `${tileArea} sqm`;
  costs.tiles = tileArea * PRICING_CONFIG.materials.tiles_sqm;

  // POP Ceiling (Flat floor area)
  // Usually same as floor area
  const popArea = Math.ceil(totalFloorArea);
  quantities.pop = `${popArea} sqm`;
  costs.pop = popArea * PRICING_CONFIG.materials.pop_sqm;

  // Paint
  // Wall area * 2 (Internal+External) / ~30sqm per drum coverage
  const paintDrums = Math.ceil((wallArea * 2.2) / 30);
  quantities.paint = `${paintDrums} drums`;
  costs.paint = paintDrums * PRICING_CONFIG.materials.paint_drum;

  // Windows
  // ~15% of Wall Surface is typical for fenestration
  const windowArea = Math.ceil(wallArea * 0.15);
  quantities.windows = `${windowArea} sqm`;
  costs.windows = windowArea * PRICING_CONFIG.materials.window_sqm;

  // Doors
  // ~1 internal door per 15sqm room avg. 2 Security doors (Front/Back)
  const internalDoors = Math.ceil(totalFloorArea / 15);
  const securityDoors = 2 * numFloors; // Main door per floor (roughly for apts)
  quantities.doors = `${internalDoors} Internal, ${securityDoors} Security`;
  costs.doors = (internalDoors * PRICING_CONFIG.materials.door_internal) + 
                (securityDoors * PRICING_CONFIG.materials.door_security);

  // --- PHASE 3: SERVICES & LABOR ---

  // MEP (Mechanical/Electrical/Plumbing)
  // Estimated as % of Structure+Finishing
  const directCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const mepCost = Math.ceil(directCost * PRICING_CONFIG.multipliers.mep_load);

  // Labor
  // Based on SQM rate or % of materials. 
  // Let's use % model for simplicity as it scales with finish quality.
  // ~25% of Direct Materials is a safe estimation for "Labor Only".
  const laborCost = Math.ceil(directCost * 0.25);

  // --- PHASE 4: CONTINGENCY ---
  const subTotal = directCost + mepCost + laborCost;
  
  // "Human Factor" / Risk
  // Random variance 5-10%
  const variancePct = 0.05 + (Math.random() * 0.05);
  const contingencyCost = Math.ceil(subTotal * variancePct);

  const grandTotal = subTotal + contingencyCost;

  return {
    materials: quantities,
    costs: {
      // Structure
      cement: costs.cement,
      blocks: costs.blocks,
      steel: costs.steel,
      aggregates: costs.aggregates,
      roofing: costs.roofing,
      
      // Finishing
      tiles: costs.tiles,
      pop: costs.pop,
      paint: costs.paint,
      windows: costs.windows,
      doors: costs.doors,
      
      // Services
      m_e_p: mepCost, // Mechanical, Electrical, Plumbing
      
      labor: laborCost,
      contingency: contingencyCost,
      
      total: grandTotal
    },
    risk: {
      level: grandTotal > 50000000 ? "High" : "Medium",
      budgetRisk: "Finishing materials (Tiles, POP) vary wildly by brand/quality.",
      timelineRisk: `Imported finishes (Doors, Tiles) may face cleared delays.`
    },
    warnings: [
      "Prices are for STANDARD quality finishes. Luxury specs will double costs.",
      "Professional supervision is assumed (avoiding quackery).",
      "MEP costs are estimates; specific design required for accuracy."
    ],
    recommendations: [
      "Buy cement in bulk to lock price.",
      "Supervise 'iron benders' closely to avoid steel waste.",
      "Consider locally fabricated windows to save ~20%."
    ]
  };
};
