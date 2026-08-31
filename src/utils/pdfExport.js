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
  const { projectType, location, buildingSize, floors, budget, timeline, notes = '' } = projectData;
  const {
    costs,
    materials,
    risk,
    warnings,
    recommendations,
    pricesLastUpdated,
    specifications,
    addons,
    totalAddonsCost,
    customMaterials,
    totalCustomMaterialsCost,
    region,
    milestones,
    estimatedDurationMonths
  } = analysis;

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
    padding: 32px 36px;
    width: 794px;
    box-sizing: border-box;
    line-height: 1.45;
  `;

  container.innerHTML = `
    <style>
      .sitepilot-pdf-root * {
        box-sizing: border-box;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .pdf-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        border-bottom: 2px solid #0f172a;
        padding-bottom: 14px;
        margin-bottom: 18px;
      }
      .pdf-logo-title {
        font-size: 24px;
        font-weight: 800;
        color: #0f172a;
        letter-spacing: -0.5px;
      }
      .pdf-logo-title span {
        color: #ea580c;
      }
      .pdf-doc-badge {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        background: #ea580c;
        color: #ffffff;
        padding: 3px 8px;
        border-radius: 3px;
        display: inline-block;
      }
      .pdf-meta-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 12px 14px;
        margin-bottom: 20px;
      }
      .pdf-meta-item {
        display: flex;
        flex-direction: column;
      }
      .pdf-meta-label {
        font-size: 9px;
        font-weight: 700;
        text-transform: uppercase;
        color: #64748b;
        letter-spacing: 0.5px;
      }
      .pdf-meta-value {
        font-size: 12px;
        font-weight: 600;
        color: #0f172a;
        margin-top: 2px;
      }
      .pdf-section {
        margin-bottom: 20px;
        page-break-inside: avoid;
        break-inside: avoid;
      }
      .pdf-section-title {
        font-size: 13px;
        font-weight: 800;
        text-transform: uppercase;
        color: #0f172a;
        border-bottom: 1px solid #cbd5e1;
        padding-bottom: 5px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      }
      .pdf-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 14px;
        font-size: 11px;
      }
      .pdf-table th {
        background: #f1f5f9;
        color: #334155;
        font-weight: 700;
        text-align: left;
        padding: 6px 10px;
        border-top: 1px solid #cbd5e1;
        border-bottom: 1px solid #cbd5e1;
        font-size: 10px;
        text-transform: uppercase;
      }
      .pdf-table td {
        padding: 6px 10px;
        border-bottom: 1px solid #e2e8f0;
        color: #1e293b;
      }
      .text-right {
        text-align: right;
      }
      .font-bold {
        font-weight: 700;
      }
      .pdf-total-card {
        background: #fff7ed;
        border: 2px solid #ea580c;
        border-radius: 6px;
        padding: 12px 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
      }
      .pdf-total-label {
        font-size: 13px;
        font-weight: 800;
        color: #9a3412;
      }
      .pdf-total-val {
        font-size: 20px;
        font-weight: 800;
        color: #ea580c;
      }
      .pdf-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        padding: 10px 12px;
        margin-bottom: 8px;
      }
      .pdf-alert-box {
        background: #fef2f2;
        border-left: 3px solid #dc2626;
        padding: 6px 10px;
        font-size: 10.5px;
        color: #991b1b;
        margin-bottom: 4px;
      }
      .pdf-footer {
        margin-top: 24px;
        padding-top: 10px;
        border-top: 1px solid #e2e8f0;
        font-size: 9px;
        color: #64748b;
        text-align: center;
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
        <span class="pdf-meta-label">Location & Region</span>
        <span class="pdf-meta-value">${location || 'N/A'} ${region ? `(${region.multiplier}x)` : ''}</span>
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
        <span class="pdf-meta-label">Target / Est. Timeline</span>
        <span class="pdf-meta-value">${estimatedDurationMonths || timeline || '12'} Months</span>
      </div>
      <div class="pdf-meta-item">
        <span class="pdf-meta-label">Currency / Pricing Basis</span>
        <span class="pdf-meta-value">${currency} (Rates: ${pricesLastUpdated || '2026-08'})</span>
      </div>
      ${notes ? `
        <div class="pdf-meta-item" style="grid-column: span 3;">
          <span class="pdf-meta-label">Engineer Notes</span>
          <span class="pdf-meta-value" style="font-size: 11px; font-weight: 500;">${notes}</span>
        </div>
      ` : ''}
    </div>

    <!-- Section 1: Detailed Cost Breakdown -->
    <div class="pdf-section">
      <div class="pdf-section-title">
        <span>1. Bill of Quantities (BOQ) & Cost Schedule</span>
        <span>All figures in ${currency}</span>
      </div>

      <table class="pdf-table">
        <thead>
          <tr>
            <th style="width: 45%;">Work Section / Trade</th>
            <th style="width: 30%;">Takeoff / Quantity</th>
            <th style="width: 25%;" class="text-right">Estimated Cost (${currencyInfo.symbol})</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">PHASE 1: SUBSTRUCTURE & SUPERSTRUCTURE</td>
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
            <td>Reinforcement Steel (TMT Rebar)</td>
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
            <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">PHASE 2: FINISHING & ARCHITECTURAL FITTINGS</td>
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

          ${customMaterials && customMaterials.length > 0 ? `
            <tr>
              <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">CUSTOM ENGINEER MATERIALS & TAKEOFF ITEMS — Total: ${fmt(totalCustomMaterialsCost)}</td>
            </tr>
            ${customMaterials.map(m => `
              <tr>
                <td>${m.name}</td>
                <td>${m.quantity} ${m.unit} @ ${fmt(m.unitPrice)}/${m.unit}</td>
                <td class="text-right font-bold">${fmt(m.lineCost)}</td>
              </tr>
            `).join('')}
          ` : ''}

          ${addons && addons.length > 0 ? `
            <tr>
              <td class="font-bold" colspan="3" style="background: #f8fafc; color: #475569;">SITE INFRASTRUCTURE & ADD-ONS — Total: ${fmt(totalAddonsCost)}</td>
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
          <div style="font-size: 10px; color: #78350f;">Includes Structure, Finishes, MEP, Labour${totalCustomMaterialsCost > 0 ? ', Custom Materials' : ''}${totalAddonsCost > 0 ? ', Add-ons' : ''} & Contingency</div>
        </div>
        <div class="pdf-total-val">${fmt(costs.total)}</div>
      </div>
    </div>

    <!-- Section 2: Milestone Cashflow & Disbursement Schedule -->
    ${milestones && milestones.length > 0 ? `
      <div class="pdf-section">
        <div class="pdf-section-title">
          <span>2. Milestone Cashflow & Valuation Schedule</span>
          <span>6 Construction Phases</span>
        </div>
        <table class="pdf-table">
          <thead>
            <tr>
              <th style="width: 25%;">Milestone Phase</th>
              <th style="width: 15%;">Allocation</th>
              <th style="width: 15%;">Est. Duration</th>
              <th style="width: 20%;" class="text-right">Valuation Amount</th>
              <th style="width: 25%;">Key Trade Activities</th>
            </tr>
          </thead>
          <tbody>
            ${milestones.map(m => `
              <tr>
                <td class="font-bold">Phase ${m.phase}: ${m.name}</td>
                <td>${m.percent}%</td>
                <td>~${m.durationMonths} Mos</td>
                <td class="text-right font-bold">${fmt(m.amount)}</td>
                <td style="font-size: 9.5px; color: #475569;">${m.trades}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- Section 3: Risk Assessment & Advisory -->
    <div class="pdf-section">
      <div class="pdf-section-title">
        <span>3. Risk Assessment & Advisory Summary</span>
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

    <!-- Section 4: Quantity Surveyor Recommendations -->
    ${recommendations && recommendations.length > 0 ? `
      <div class="pdf-section">
        <div class="pdf-section-title">
          <span>4. Quantity Surveyor Recommendations</span>
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

  // PDF Generation Options
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `SitePilot_Estimate_${(projectType || 'estimate').toLowerCase()}_${new Date().toISOString().split('T')[0]}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy']
    }
  };

  html2pdf().set(opt).from(container).save();
};
