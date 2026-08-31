import html2pdf from 'html2pdf.js';
import { getCurrencyInfo, getUnitInfo, formatCurrency } from './currencyFormatter';

/**
 * SitePilot Professional PDF Export Engine
 * Generates a clean, crisp, high-contrast, print-optimized construction estimate report.
 */
export const exportEstimatePDF = (projectData, analysis, currency = 'NGN', unit = 'sqm') => {
  if (!projectData || !analysis || !analysis.costs) return;

  const currencyInfo = getCurrencyInfo(currency);
  const unitInfo = getUnitInfo(unit);
  const { projectType, location, buildingSize, floors, budget, timeline, notes } = projectData;
  const { costs, materials, risk, warnings, recommendations, pricesLastUpdated, specifications, addons, totalAddonsCost } = analysis;

  const dateStr = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const fmt = (amount) => formatCurrency(amount, currency);

  // Build clean, high-contrast HTML document specifically for PDF printing
  const container = document.createElement('div');
  container.className = 'sitepilot-pdf-root';
  container.style.cssText = `
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    color: #0f172a;
    background: #ffffff;
    padding: 24px;
    width: 760px;
    box-sizing: border-box;
    line-height: 1.45;
    font-size: 12px;
  `;

  // Aggregate cost centres
  const structureCost =
    (costs.cement || 0) + (costs.blocks || 0) + (costs.steel || 0) + (costs.aggregates || 0) + (costs.roofing || 0);
  const finishesCost =
    (costs.tiles || 0) + (costs.pop || 0) + (costs.paint || 0) + (costs.windows || 0) + (costs.doors || 0);

  container.innerHTML = `
    <style>
      .pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid #FF6B00;
        padding-bottom: 12px;
        margin-bottom: 16px;
      }
      .pdf-logo-title {
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.5px;
      }
      .pdf-logo-title span { color: #FF6B00; }
      .pdf-doc-badge {
        background: #fff7ed;
        color: #c2410c;
        border: 1px solid #fed7aa;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .pdf-meta-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 14px;
      }
      .pdf-meta-item { display: flex; flex-direction: column; }
      .pdf-meta-label { font-size: 10px; color: #64748b; text-transform: uppercase; font-weight: 600; }
      .pdf-meta-value { font-size: 12px; color: #0f172a; font-weight: 700; margin-top: 2px; }
      
      .pdf-specs-pill-bar {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 14px;
      }
      .pdf-spec-pill {
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10.5px;
        color: #334155;
        font-weight: 600;
      }
      .pdf-spec-pill strong { color: #FF6B00; }

      .pdf-section {
        margin-bottom: 18px;
        page-break-inside: avoid;
      }
      .pdf-section-title {
        font-size: 14px;
        font-weight: 700;
        color: #0f172a;
        border-bottom: 1px solid #e2e8f0;
        padding-bottom: 6px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .pdf-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
      }
      .pdf-table th {
        background: #f1f5f9;
        color: #334155;
        font-weight: 700;
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid #cbd5e1;
      }
      .pdf-table td {
        padding: 6px 8px;
        border-bottom: 1px solid #f1f5f9;
        color: #1e293b;
      }
      .pdf-table tr:nth-child(even) td { background: #fafafa; }
      .pdf-table .text-right { text-align: right; }
      .pdf-table .font-bold { font-weight: 700; }

      .pdf-total-card {
        background: #fff7ed;
        border: 2px solid #FF6B00;
        border-radius: 8px;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 14px;
        page-break-inside: avoid;
      }
      .pdf-total-label { font-size: 13px; font-weight: 700; color: #9a3412; }
      .pdf-total-val { font-size: 20px; font-weight: 800; color: #c2410c; }

      .pdf-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 10px 12px;
        margin-bottom: 10px;
        page-break-inside: avoid;
      }
      .pdf-alert-box {
        background: #fefce8;
        border: 1px solid #fef08a;
        color: #854d0e;
        padding: 8px 10px;
        border-radius: 6px;
        font-size: 10.5px;
        margin-bottom: 6px;
      }
      .pdf-footer {
        border-top: 1px solid #e2e8f0;
        padding-top: 10px;
        font-size: 9.5px;
        color: #94a3b8;
        text-align: center;
        margin-top: 20px;
      }
    </style>

    <!-- Header -->
    <div class="pdf-header">
      <div>
        <div class="pdf-logo-title">Site<span>Pilot</span></div>
        <div style="font-size: 11px; color: #64748b; font-weight: 500;">Pre-Construction Intelligence & Bill of Quantities</div>
      </div>
      <div style="text-align: right;">
        <div class="pdf-doc-badge">Official Cost Estimate</div>
        <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Date: ${dateStr}</div>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="pdf-meta-grid">
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Project Type</span>
        <span class="pdf-meta-value">${(projectType || 'Residential').toUpperCase()}</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Location</span>
        <span class="pdf-meta-value">${location || 'N/A'}</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Building Area</span>
        <span class="pdf-meta-value">${buildingSize} ${unitInfo.symbol} (${floors} Floors)</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Specification Tier</span>
        <span class="pdf-meta-value">${specifications?.specTierName || 'Standard'}</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Client Budget</span>
        <span class="pdf-meta-value">${budget ? fmt(budget) : 'Not Specified'}</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Target Timeline</span>
        <span class="pdf-meta-value">${timeline ? `${timeline} Months` : 'Not Specified'}</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Currency / Pricing Basis</span>
        <span class="pdf-meta-value">${currency} (Rates: ${pricesLastUpdated || '2026-08'})</span>
      </div>
    </div>

    <!-- Engineering Specs Summary Pills -->
    ${specifications ? `
      <div class="pdf-specs-pill-bar">
        <div class="pdf-spec-pill">Substructure: <strong>${specifications.foundationName}</strong></div>
        <div class="pdf-spec-pill">Flooring: <strong>${specifications.flooringName}</strong></div>
        <div class="pdf-spec-pill">Roofing: <strong>${specifications.roofingName}</strong></div>
        <div class="pdf-spec-pill">Ceiling: <strong>${specifications.ceilingName}</strong></div>
      </div>
    ` : ''}

    ${notes ? `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 12px; margin-bottom: 14px; font-size: 11px;">
        <strong style="color: #475569;">Client Project Notes:</strong> <span style="color: #334155;">${notes}</span>
      </div>
    ` : ''}

    <!-- Section 1: Materials Takeoff & Cost Breakdown -->
    <div class="pdf-section">
      <div class="pdf-section-title">
        <span>1. Cost Breakdown & Material Quantities</span>
        <span style="font-size: 11px; color: #64748b; font-weight: normal;">All values in ${currency}</span>
      </div>
      <table class="pdf-table">
        <thead>
          <tr>
            <th style="width: 40%;">Trade / Work Section</th>
            <th style="width: 35%;">Takeoff Quantity</th>
            <th style="width: 25%;" class="text-right">Estimated Cost (${currencyInfo.symbol})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">PHASE 1: STRUCTURE (SHELL) — Total: ${fmt(structureCost)}</td>
          </tr>
          <tr>
            <td>Cement (Foundation, Plaster, Screed)</td>
            <td>${materials.cement || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.cement)}</td>
          </tr>
          <tr>
            <td>Sandcrete Blocks (9" load bearing)</td>
            <td>${materials.blocks || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.blocks)}</td>
          </tr>
          <tr>
            <td>Reinforcement Steel (TMT)</td>
            <td>${materials.steel || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.steel)}</td>
          </tr>
          <tr>
            <td>Aggregates (Sharp Sand & Granite)</td>
            <td>${materials.sand || ''}, ${materials.granite || ''}</td>
            <td class="text-right font-bold">${fmt(costs.aggregates)}</td>
          </tr>
          <tr>
            <td>Roofing System</td>
            <td>${materials.roofing || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.roofing)}</td>
          </tr>

          <tr>
            <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">PHASE 2: FINISHING & FITTINGS — Total: ${fmt(finishesCost)}</td>
          </tr>
          <tr>
            <td>Floor & Wall Tiles</td>
            <td>${materials.tiles || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.tiles)}</td>
          </tr>
          <tr>
            <td>Ceiling System</td>
            <td>${materials.pop || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.pop)}</td>
          </tr>
          <tr>
            <td>Paint & Surface Coating</td>
            <td>${materials.paint || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.paint)}</td>
          </tr>
          <tr>
            <td>Glazed Windows</td>
            <td>${materials.windows || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.windows)}</td>
          </tr>
          <tr>
            <td>Doors (Security & Internal Flush)</td>
            <td>${materials.doors || 'N/A'}</td>
            <td class="text-right font-bold">${fmt(costs.doors)}</td>
          </tr>

          <tr>
            <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">PHASE 3: SERVICES & TRADE LABOUR</td>
          </tr>
          <tr>
            <td>MEP Services (Mechanical, Electrical, Plumbing 18%)</td>
            <td>Standard Installation Load</td>
            <td class="text-right font-bold">${fmt(costs.m_e_p)}</td>
          </tr>
          <tr>
            <td>Direct Trade Labour (25% Direct Load)</td>
            <td>Full Construction Trades</td>
            <td class="text-right font-bold">${fmt(costs.labor)}</td>
          </tr>

          ${addons && addons.length > 0 ? `
            <tr>
              <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">PHASE 4: SITE INFRASTRUCTURE & ADD-ONS — Total: ${fmt(totalAddonsCost)}</td>
            </tr>
            ${addons.map(a => `
              <tr>
                <td>${a.name}</td>
                <td>${a.category}</td>
                <td class="text-right font-bold">${fmt(a.cost)}</td>
              </tr>
            `).join('')}
          ` : ''}

          <tr>
            <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">CONTINGENCY PROVISION</td>
          </tr>
          <tr>
            <td>Unforeseen Contingency Provision</td>
            <td>5–10% Variance Reserve</td>
            <td class="text-right font-bold">${fmt(costs.contingency)}</td>
          </tr>
        </tbody>
      </table>

      <!-- Grand Total Highlight -->
      <div class="pdf-total-card">
        <div>
          <div class="pdf-total-label">ESTIMATED TOTAL PROJECT COST</div>
          <div style="font-size: 10px; color: #78350f;">Includes Structure, Finishes, MEP, Labour${totalAddonsCost > 0 ? ', Add-ons' : ''} & Contingency</div>
        </div>
        <div class="pdf-total-val">${fmt(costs.total)}</div>
      </div>
    </div>

    <!-- Section 2: Risk Assessment & Advisory -->
    <div class="pdf-section">
      <div class="pdf-section-title">
        <span>2. Risk Assessment & Advisory Summary</span>
        <span style="font-size: 11px; font-weight: 700; color: ${risk.level === 'High' ? '#dc2626' : risk.level === 'Medium' ? '#d97706' : '#16a34a'};">
          ${risk.level || 'Medium'} Risk Profile
        </span>
      </div>
      
      <div class="pdf-card">
        <div style="font-weight: 700; font-size: 11px; color: #334155; margin-bottom: 3px;">Budget Analysis:</div>
        <div style="color: #475569; font-size: 11px;">${risk.budgetRisk || 'N/A'}</div>
      </div>

      <div class="pdf-card">
        <div style="font-weight: 700; font-size: 11px; color: #334155; margin-bottom: 3px;">Timeline Analysis:</div>
        <div style="color: #475569; font-size: 11px;">${risk.timelineRisk || 'N/A'}</div>
      </div>

      ${warnings && warnings.length > 0 ? `
        <div style="margin-top: 8px;">
          ${warnings.map(w => `<div class="pdf-alert-box">⚠️ ${w}</div>`).join('')}
        </div>
      ` : ''}
    </div>

    <!-- Section 3: Expert QS Recommendations -->
    ${recommendations && recommendations.length > 0 ? `
      <div class="pdf-section">
        <div class="pdf-section-title">
          <span>3. Quantity Surveyor Recommendations</span>
        </div>
        <div class="pdf-card">
          <ul style="margin: 0; padding-left: 16px; color: #334155; font-size: 11px;">
            ${recommendations.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : ''}

    <!-- Footer -->
    <div class="pdf-footer">
      Generated automatically by SitePilot Construction Intelligence Platform • Rates based on Nigerian QS Heuristics (${pricesLastUpdated || '2026-08'}) • Not a binding architectural contract.
    </div>
  `;

  // Render using html2pdf with high resolution
  const opt = {
    margin: [0.35, 0.4, 0.35, 0.4],
    filename: `SitePilot_Report_${projectType || 'Project'}_${currency}_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2.2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(container).save();
};
