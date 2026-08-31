import React, { useRef, useState } from 'react';
import MaterialEstimates from './MaterialEstimates';
import CostAnalysis from './CostAnalysis';
import RiskAssessment from './RiskAssessment';
import Recommendations from './Recommendations';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';
import { downloadBOQCSV } from '../../utils/csvExport';
import { exportEstimatePDF } from '../../utils/pdfExport';

const Results = () => {
  const { projectData, analysisResults: analysis, resetProject, currency, currencyInfo, unit, unitInfo, formatMoney } = useProject();
  const contentRef = useRef(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const downloadPDF = () => {
    exportEstimatePDF(projectData, analysis, currency, unit);
  };

  const handleDownloadCSV = () => {
    downloadBOQCSV(projectData, analysis, currency);
  };

  const specs = analysis.specifications;
  const addons = analysis.addons || [];

  return (
    <div className="results-container fade-in">
      <div className="container">
        <div className="form-card slide-up" ref={contentRef}>
          <div className="results-top-bar">
            <div className="estimate-badge">
              <Icon name="drafting" size={15} color="var(--primary)" />
              <span>Smart Estimate — {specs?.specTierName || 'Standard Grade'}</span>
            </div>
            
            <div className="currency-pill" data-html2canvas-ignore="true">
              Active Currency: <strong>{currencyInfo.name} ({currencyInfo.symbol} {currency})</strong>
            </div>
          </div>

          <h2 id="results-title" className="section-title">
            {projectData.projectType.charAt(0).toUpperCase() + projectData.projectType.slice(1)} Project Estimate
          </h2>
          <p className="section-subtitle">
            {projectData.buildingSize} {unitInfo.symbol} • {projectData.floors} floors • {projectData.location}
          </p>

          {/* Engineering Specifications Summary Bar */}
          {specs && (
            <div className="specs-pills-container">
              <div className="spec-pill-item">
                <span className="spec-pill-label">Tier:</span> <strong>{specs.specTierName}</strong>
              </div>
              <div className="spec-pill-item">
                <span className="spec-pill-label">Foundation:</span> <strong>{specs.foundationName}</strong>
              </div>
              <div className="spec-pill-item">
                <span className="spec-pill-label">Flooring:</span> <strong>{specs.flooringName}</strong>
              </div>
              <div className="spec-pill-item">
                <span className="spec-pill-label">Roofing:</span> <strong>{specs.roofingName}</strong>
              </div>
              <div className="spec-pill-item">
                <span className="spec-pill-label">Ceiling:</span> <strong>{specs.ceilingName}</strong>
              </div>
            </div>
          )}

          {analysis.pricesLastUpdated && (
            <p className="prices-disclaimer" style={{ marginTop: '1rem' }}>
              <Icon name="mep" size={14} color="var(--primary)" style={{ marginRight: '0.4rem' }} />
              Prices last updated: <strong>{analysis.pricesLastUpdated}</strong>. Review <code>pricing.config.json</code> or click "Material Rates" in the header to adjust prices.
            </p>
          )}

          {analysis.warnings && analysis.warnings.length > 0 && (
            <div>
              {analysis.warnings.map((warning, idx) => (
                <div key={idx} className="alert slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="alert-icon">
                    <Icon name="warning" size={20} color="var(--warning)" />
                  </div>
                  <div>{warning}</div>
                </div>
              ))}
            </div>
          )}

          <div className="results-grid slide-up" style={{ animationDelay: '0.3s' }}>
            <MaterialEstimates materials={analysis.materials} customMaterials={analysis.customMaterials} />
            <CostAnalysis costs={analysis.costs} />
            <RiskAssessment risk={analysis.risk} />
            <Recommendations recommendations={analysis.recommendations} />
          </div>

          {/* Selected Add-ons Breakdown (if any) */}
          {addons.length > 0 && (
            <div className="result-card slide-up" style={{ marginTop: '1.5rem' }}>
              <h3 className="result-card-title">
                <Icon name="mep" size={22} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Selected Site Infrastructure & Add-ons
              </h3>
              <div className="materials-list">
                {addons.map((addon) => (
                  <div key={addon.key} className="material-item">
                    <div className="material-name-container">
                      <Icon name={addon.icon || 'mep'} size={18} color="var(--primary)" />
                      <div>
                        <div className="material-name">{addon.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{addon.category}</div>
                      </div>
                    </div>
                    <span className="material-quantity">{formatMoney(addon.cost)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="button-group results-actions" style={{ marginTop: '2rem' }} data-html2canvas-ignore="true">
            <button
              className="btn-secondary btn-hover"
              onClick={() => setShowConfirmReset(true)}
            >
              New Estimate
            </button>
            <button
              className="btn-secondary btn-hover"
              onClick={handleDownloadCSV}
              title="Download spreadsheet compatible with Microsoft Excel and Google Sheets"
            >
              <Icon name="spreadsheet" size={16} style={{ marginRight: '0.4rem' }} /> Download BOQ (.CSV)
            </button>
            <button
              className="btn-primary btn-hover"
              onClick={downloadPDF}
              title="Download clean, high-contrast professional PDF estimate report"
            >
              <Icon name="pdf" size={16} style={{ marginRight: '0.4rem' }} /> Download PDF Report
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmReset}
        title="Start a new estimate?"
        message="This will clear your current estimate results and inputs. If needed, download the PDF or BOQ spreadsheet first."
        confirmText="Yes, start new"
        cancelText="Keep current estimate"
        onConfirm={() => {
          setShowConfirmReset(false);
          resetProject();
        }}
        onCancel={() => setShowConfirmReset(false)}
      />
    </div>
  );
};

export default Results;
