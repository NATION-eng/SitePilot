import React, { useRef, useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import CostAnalysis from './CostAnalysis';
import MaterialEstimates from './MaterialEstimates';
import RiskAssessment from './RiskAssessment';
import Recommendations from './Recommendations';
import MilestoneSchedule from './MilestoneSchedule';
import StressTestMatrix from './StressTestMatrix';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';
import { downloadBOQCSV } from '../../utils/csvExport';
import { exportEstimatePDF } from '../../utils/pdfExport';

const Results = () => {
  const { projectData, analysisResults: analysis, resetProject, currency, currencyInfo, unit, unitInfo, formatMoney, saveCurrentProject } = useProject();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const contentRef = useRef(null);

  if (!analysis) return null;

  const specs = analysis.specifications;
  const addons = analysis.addons || [];

  const handleDownloadCSV = () => {
    downloadBOQCSV(projectData, analysis, currency);
  };

  const downloadPDF = () => {
    exportEstimatePDF(projectData, analysis, currency, unit);
  };

  const handleSaveToPortfolio = () => {
    saveCurrentProject();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="results fade-in">
      <div className="container">
        <div className="form-card slide-up" ref={contentRef}>
          <div className="results-top-bar">
            <div className="estimate-badge">
              <Icon name="drafting" size={15} color="var(--primary)" />
              <span>Smart Estimate — {specs?.specTierName || 'Standard Grade'}</span>
            </div>
            
            <div className="currency-pill" data-html2canvas-ignore="true">
              Active Currency: <strong>{currencyInfo?.name || 'Naira'} ({currencyInfo?.symbol || '₦'} {currency})</strong>
            </div>
          </div>

          <h2 id="results-title" className="section-title">
            {projectData.projectType ? projectData.projectType.charAt(0).toUpperCase() + projectData.projectType.slice(1) : 'Project'} Estimate
          </h2>
          <p className="section-subtitle">
            {projectData.buildingSize} {unitInfo?.symbol || 'm²'} • {projectData.floors} floors • {projectData.location || 'Site Location'}
          </p>

          {/* Engineering Specifications & Regional Cost Index Summary Bar */}
          <div className="specs-pills-container">
            {analysis.region && (
              <div className="spec-pill-item">
                <span className="spec-pill-label">Location Index:</span> <strong>{analysis.region.name.split(' (')[0]} ({analysis.region.multiplier}x)</strong>
              </div>
            )}
            {specs && (
              <>
                <div className="spec-pill-item">
                  <span className="spec-pill-label">Tier:</span> <strong>{specs.specTierName}</strong>
                </div>
                <div className="spec-pill-item">
                  <span className="spec-pill-label">Flooring:</span> <strong>{specs.flooringName.split(' ')[0]}</strong>
                </div>
                <div className="spec-pill-item">
                  <span className="spec-pill-label">Roof:</span> <strong>{specs.roofingName.split(' ')[0]}</strong>
                </div>
                <div className="spec-pill-item">
                  <span className="spec-pill-label">Ceiling:</span> <strong>{specs.ceilingName.split(' ')[0]}</strong>
                </div>
                <div className="spec-pill-item">
                  <span className="spec-pill-label">Substructure:</span> <strong>{specs.foundationName.split(' ')[0]}</strong>
                </div>
              </>
            )}
          </div>

          {/* Critical Warnings */}
          {analysis.warnings && analysis.warnings.length > 0 && (
            <div className="alerts-container">
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
              <div className="addons-list">
                {addons.map((addon) => (
                  <div key={addon.key} className="addon-row">
                    <div className="addon-main">
                      <div className="addon-icon-badge">
                        <Icon name={addon.icon || 'mep'} size={18} color="var(--primary)" />
                      </div>
                      <div className="addon-details">
                        <div className="addon-title">{addon.name}</div>
                        <div className="addon-tag">{addon.category}</div>
                      </div>
                    </div>
                    <div className="addon-amount">{formatMoney(addon.cost)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phase-by-Phase Milestone Cashflow Schedule */}
          <MilestoneSchedule
            milestones={analysis.milestones}
            estimatedDurationMonths={analysis.estimatedDurationMonths}
          />

          {/* Inflation & FX Sensitivity Stress Testing */}
          <StressTestMatrix
            stressTests={analysis.stressTests}
            baseTotal={analysis.costs.total}
            budget={projectData.budget}
          />

          {/* Action Buttons */}
          <div className="button-group results-actions" style={{ marginTop: '2rem' }} data-html2canvas-ignore="true">
            <button
              className="btn-secondary btn-hover"
              onClick={() => setShowConfirmReset(true)}
            >
              New Estimate
            </button>
            <button
              className="btn-secondary btn-hover"
              onClick={handleSaveToPortfolio}
              title="Save this estimate to your local project portfolio"
            >
              <Icon name="check" size={16} color={isSaved ? '#00D9A3' : 'var(--primary)'} style={{ marginRight: '0.4rem' }} />
              {isSaved ? 'Saved to Portfolio!' : 'Save to Portfolio'}
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
        message="This will clear your current estimate results and inputs. If needed, save to portfolio or download the PDF first."
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
