import { formatCurrency } from './currencyFormatter';

/**
 * SitePilot Professional BOQ CSV Generator
 * Generates an Excel-ready, UTF-8 encoded Bill of Quantities CSV spreadsheet.
 */
export const generateBOQCSV = (projectData, analysis, currency = 'NGN') => {
  if (!projectData || !analysis || !analysis.costs) return '';

  const { projectType, location, buildingSize, floors, budget, timeline, notes } = projectData;
  const { costs, materials, risk, warnings, recommendations, pricesLastUpdated, specifications, addons, customMaterials } = analysis;

  const rows = [];
  const fmtCost = (amount) => formatCurrency(amount, currency);

  // 1. Header Information
  rows.push(['SITEPILOT PRE-CONSTRUCTION INTELLIGENCE REPORT']);
  rows.push(['BILL OF QUANTITIES (BOQ) & COST ESTIMATE BREAKDOWN']);
  rows.push(['Generated On', new Date().toLocaleString()]);
  rows.push(['Currency', currency]);
  rows.push(['Pricing Baseline Source', `Nigerian QS Heuristics (Ref: ${pricesLastUpdated || '2026-08'})`]);
  rows.push([]);

  // 2. Project Parameters
  rows.push(['--- PROJECT PARAMETERS ---']);
  rows.push(['Project Type', (projectType || 'Residential').toUpperCase()]);
  rows.push(['Location', location || 'Not Specified']);
  rows.push(['Gross Floor Area', `${buildingSize} sqm`]);
  rows.push(['Number of Floors', floors || '1']);
  rows.push(['Client Budget', budget ? fmtCost(budget) : 'Not Specified']);
  rows.push(['Target Timeline', timeline ? `${timeline} Months` : 'Not Specified']);
  if (notes) rows.push(['Engineer Notes', notes]);
  rows.push([]);

  // 2b. Engineering Specifications
  if (specifications) {
    rows.push(['--- PROJECT SPECIFICATIONS & ENGINEERING GRADE ---']);
    rows.push(['Finish Quality Grade', specifications.specTierName || 'Standard']);
    rows.push(['Substructure / Soil Condition', specifications.foundationName || 'Strip Foundation']);
    rows.push(['Selected Flooring Material', specifications.flooringName || 'Standard Ceramic Tiles']);
    rows.push(['Selected Roofing System', specifications.roofingName || 'Aluminium Longspan']);
    rows.push(['Selected Ceiling System', specifications.ceilingName || 'POP Plasterboard']);
    rows.push([]);
  }

  // 3. BOQ Line Items Table
  rows.push(['ITEM NO', 'TRADE / WORK SECTION', 'QUANTITY / TAKEOFF', `ESTIMATED COST (${currency})`]);

  // Phase 1: Structure
  rows.push(['1.0', 'PHASE 1: SUBSTRUCTURE & SUPERSTRUCTURE', '', '']);
  rows.push(['1.1', 'Cement (Foundation, Plaster, Screed)', materials.cement || 'N/A', fmtCost(costs.cement)]);
  rows.push(['1.2', 'Sandcrete Blocks (9" load bearing)', materials.blocks || 'N/A', fmtCost(costs.blocks)]);
  rows.push(['1.3', 'Reinforcement Steel (TMT)', materials.steel || 'N/A', fmtCost(costs.steel)]);
  rows.push(['1.4', 'Aggregates (Sharp Sand & Granite)', `${materials.sand || ''}, ${materials.granite || ''}`, fmtCost(costs.aggregates)]);
  rows.push(['1.5', 'Roofing System', materials.roofing || 'N/A', fmtCost(costs.roofing)]);

  // Phase 2: Finishing
  rows.push(['2.0', 'PHASE 2: FINISHING & ARCHITECTURAL FITTINGS', '', '']);
  rows.push(['2.1', 'Floor & Wall Tiles', materials.tiles || 'N/A', fmtCost(costs.tiles)]);
  rows.push(['2.2', 'Ceiling System', materials.pop || 'N/A', fmtCost(costs.pop)]);
  rows.push(['2.3', 'Paint & Surface Coating', materials.paint || 'N/A', fmtCost(costs.paint)]);
  rows.push(['2.4', 'Glazed Windows', materials.windows || 'N/A', fmtCost(costs.windows)]);
  rows.push(['2.5', 'Doors (Security & Internal Flush)', materials.doors || 'N/A', fmtCost(costs.doors)]);

  // Phase 3: Services & Labour
  rows.push(['3.0', 'PHASE 3: SERVICES & TRADE LABOUR', '', '']);
  rows.push(['3.1', 'MEP (Mechanical, Electrical & Plumbing 18%)', 'Full Installation Load', fmtCost(costs.m_e_p)]);
  rows.push(['3.2', 'Direct Trade Labour (Blended QS Rate)', 'All Trades Combined', fmtCost(costs.labor)]);

  let nextPhase = 4;

  // Custom User Materials (if any)
  if (customMaterials && customMaterials.length > 0) {
    rows.push([`${nextPhase}.0`, 'PHASE ' + nextPhase + ': CUSTOM ENGINEER MATERIALS & TAKEOFF ITEMS', '', '']);
    customMaterials.forEach((item, i) => {
      rows.push([
        `${nextPhase}.${i + 1}`,
        item.name,
        `${item.quantity} ${item.unit} @ ${fmtCost(item.unitPrice)}/${item.unit}`,
        fmtCost(item.lineCost)
      ]);
    });
    nextPhase++;
  }

  // Phase 4/5: Engineering Add-ons & Site Infrastructure (if any)
  if (addons && addons.length > 0) {
    rows.push([`${nextPhase}.0`, `PHASE ${nextPhase}: SITE INFRASTRUCTURE & ENGINEERING ADD-ONS`, '', '']);
    addons.forEach((addon, i) => {
      rows.push([`${nextPhase}.${i + 1}`, addon.name, addon.category, fmtCost(addon.cost)]);
    });
    nextPhase++;
  }

  // Final Phase: Contingency & Total
  rows.push([`${nextPhase}.0`, `PHASE ${nextPhase}: CONTINGENCY & GRAND TOTAL`, '', '']);
  rows.push([`${nextPhase}.1`, 'Unforeseen Contingency Provision', 'Deterministic 5-10% Range', fmtCost(costs.contingency)]);
  rows.push([`${nextPhase}.2`, 'ESTIMATED GRAND TOTAL', '', fmtCost(costs.total)]);
  rows.push([]);

  // 4. Risk & Advisory Assessment
  rows.push(['--- RISK & ADVISORY SUMMARY ---']);
  rows.push(['Overall Risk Rating', risk?.level || 'Medium']);
  rows.push(['Budget Evaluation', risk?.budgetRisk || 'N/A']);
  rows.push(['Timeline Evaluation', risk?.timelineRisk || 'N/A']);
  rows.push([]);

  // 5. Warnings & Recommendations
  if (warnings && warnings.length > 0) {
    rows.push(['--- CRITICAL PROJECT WARNINGS ---']);
    warnings.forEach((w, i) => rows.push([`Warning ${i + 1}`, w]));
    rows.push([]);
  }

  if (recommendations && recommendations.length > 0) {
    rows.push(['--- EXPERT QS RECOMMENDATIONS ---']);
    recommendations.forEach((r, i) => rows.push([`Recommendation ${i + 1}`, r]));
    rows.push([]);
  }

  // 6. Escape and serialize to CSV format with UTF-8 BOM
  const csvContent = rows.map(row => {
    return row.map(cell => {
      if (cell === null || cell === undefined) return '""';
      const cellStr = String(cell).replace(/"/g, '""');
      return `"${cellStr}"`;
    }).join(',');
  }).join('\r\n');

  return '\uFEFF' + csvContent;
};

/**
 * Triggers a direct browser download of the generated CSV file.
 */
export const downloadBOQCSV = (projectData, analysis, currency = 'NGN') => {
  const csvString = generateBOQCSV(projectData, analysis, currency);
  if (!csvString) return;

  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const projectName = projectData.projectType ? projectData.projectType.toLowerCase() : 'project';
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `SitePilot_BOQ_${projectName}_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
