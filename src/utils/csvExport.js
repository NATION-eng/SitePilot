/**
 * SitePilot Bill of Quantities (BOQ) CSV Export Utility
 * Generates an Excel-compatible CSV with UTF-8 BOM.
 */

export const generateBOQCSV = (projectData, analysis, currencySymbol = '₦') => {
  if (!projectData || !analysis || !analysis.costs) return '';

  const { projectType, location, buildingSize, floors, budget, timeline, notes } = projectData;
  const { costs, materials, risk, warnings, recommendations, pricesLastUpdated } = analysis;

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '';
    const stringified = String(str);
    if (stringified.includes(',') || stringified.includes('"') || stringified.includes('\n')) {
      return `"${stringified.replace(/"/g, '""')}"`;
    }
    return stringified;
  };

  const rows = [];

  // 1. Header Banner
  rows.push(['SITEPILOT - PRE-CONSTRUCTION BILL OF QUANTITIES (BOQ)']);
  rows.push(['Generated Date', new Date().toISOString().split('T')[0]]);
  rows.push(['Pricing Basis', `Nigerian QS Standards (Rates last updated: ${pricesLastUpdated || '2026-08'})`]);
  rows.push([]);

  // 2. Project Specifications
  rows.push(['--- PROJECT SPECIFICATIONS ---']);
  rows.push(['Project Type', projectType ? projectType.toUpperCase() : 'N/A']);
  rows.push(['Location', location || 'N/A']);
  rows.push(['Building Floor Area', `${buildingSize || 0} sqm`]);
  rows.push(['Number of Floors', floors || 1]);
  rows.push(['Client Budget', budget ? `${currencySymbol}${parseFloat(budget).toLocaleString()}` : 'Not Specified']);
  rows.push(['Target Timeline', timeline ? `${timeline} months` : 'Not Specified']);
  if (notes) rows.push(['Notes / Requirements', notes]);
  rows.push([]);

  // 3. BOQ Line Items Table
  rows.push(['ITEM NO', 'TRADE / WORK SECTION', 'QUANTITY / TAKEOFF', `ESTIMATED COST (${currencySymbol})`]);

  // Phase 1: Structure
  rows.push(['1.0', 'PHASE 1: SUBSTRUCTURE & SUPERSTRUCTURE', '', '']);
  rows.push(['1.1', 'Cement (Foundation, Plaster, Screed)', materials.cement || 'N/A', costs.cement || 0]);
  rows.push(['1.2', 'Sandcrete Blocks (9" load bearing)', materials.blocks || 'N/A', costs.blocks || 0]);
  rows.push(['1.3', 'Reinforcement Steel (TMT)', materials.steel || 'N/A', costs.steel || 0]);
  rows.push(['1.4', 'Aggregates (Sharp Sand & Granite)', `${materials.sand || ''}, ${materials.granite || ''}`, costs.aggregates || 0]);
  rows.push(['1.5', 'Roofing System (Aluminium 0.55mm)', materials.roofing || 'N/A', costs.roofing || 0]);

  // Phase 2: Finishing
  rows.push(['2.0', 'PHASE 2: FINISHING & ARCHITECTURAL FITTINGS', '', '']);
  rows.push(['2.1', 'Floor & Wall Tiles (Vitrified/Ceramic)', materials.tiles || 'N/A', costs.tiles || 0]);
  rows.push(['2.2', 'Ceiling System (POP Boarding/Cast)', materials.pop || 'N/A', costs.pop || 0]);
  rows.push(['2.3', 'Paint & Surface Coating (Quality Emulsion)', materials.paint || 'N/A', costs.paint || 0]);
  rows.push(['2.4', 'Glazed Aluminium Windows', materials.windows || 'N/A', costs.windows || 0]);
  rows.push(['2.5', 'Doors (Security & Internal Flush)', materials.doors || 'N/A', costs.doors || 0]);

  // Phase 3: Services & Labour
  rows.push(['3.0', 'PHASE 3: SERVICES & TRADE LABOUR', '', '']);
  rows.push(['3.1', 'MEP (Mechanical, Electrical & Plumbing 18%)', 'Full Installation Load', costs.m_e_p || 0]);
  rows.push(['3.2', 'Direct Trade Labour (Blended QS Rate)', 'All Trades Combined', costs.labor || 0]);

  // Phase 4: Contingency & Total
  rows.push(['4.0', 'PHASE 4: CONTINGENCY & GRAND TOTAL', '', '']);
  rows.push(['4.1', 'Unforeseen Contingency Provision', 'Deterministic 5-10% Range', costs.contingency || 0]);
  rows.push(['4.2', 'ESTIMATED GRAND TOTAL', '', costs.total || 0]);
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
  }

  // Format into CSV string
  const csvContent = rows
    .map(row => row.map(escapeCSV).join(','))
    .join('\r\n');

  // Prefix UTF-8 BOM so Excel opens with proper accents and currency symbols
  return '\uFEFF' + csvContent;
};

/**
 * Triggers a browser download of the BOQ CSV file.
 */
export const downloadBOQCSV = (projectData, analysis, currencySymbol = '₦') => {
  const csv = generateBOQCSV(projectData, analysis, currencySymbol);
  if (!csv) return;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  const projectType = projectData?.projectType || 'project';
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `SitePilot_BOQ_${projectType}_${dateStr}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
