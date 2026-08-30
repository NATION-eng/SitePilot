import React, { useRef, useState } from 'react';
import MaterialEstimates from './MaterialEstimates';
import CostAnalysis from './CostAnalysis';
import RiskAssessment from './RiskAssessment';
import Recommendations from './Recommendations';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';
import { downloadBOQCSV } from '../../utils/csvExport';
import html2pdf from 'html2pdf.js';

const Results = () => {
  const { projectData, analysisResults: analysis, resetProject, currencyInfo, unitInfo } = useProject();
  const contentRef = useRef(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const downloadPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `SitePilot_Estimate_${projectData.projectType}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: '#141921',
        logging: false
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadCSV = () => {
    downloadBOQCSV(projectData, analysis, currencyInfo.symbol);
  };

  return (
    <div className="results-container fade-in">
      <div className="container">
        <div className="form-card slide-up" ref={contentRef}>
          <div className="results-top-bar">
            <div className="estimate-badge">
              <Icon name="drafting" size={15} color="var(--primary)" />
              <span>Smart Estimate — QS Algorithm</span>
            </div>
            
            <div className="currency-pill" data-html2canvas-ignore="true">
              Displaying in <strong>{currencyInfo.name} ({currencyInfo.symbol})</strong>
            </div>
          </div>

          <h2 id="results-title" className="section-title">
            {projectData.projectType.charAt(0).toUpperCase() + projectData.projectType.slice(1)} Project Estimate
          </h2>
          <p className="section-subtitle">
            {projectData.buildingSize} {unitInfo.symbol} • {projectData.floors} floors • {projectData.location}
          </p>

          {analysis.pricesLastUpdated && (
            <p className="prices-disclaimer">
              <Icon name="mep" size={14} color="var(--primary)" style={{ marginRight: '0.4rem' }} />
              Prices last updated: <strong>{analysis.pricesLastUpdated}</strong>. Review <code>pricing.config.json</code> to update rates.
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
            <MaterialEstimates materials={analysis.materials} />
            <CostAnalysis costs={analysis.costs} currencySymbol={currencyInfo.symbol} />
            <RiskAssessment risk={analysis.risk} />
            <Recommendations recommendations={analysis.recommendations} />
          </div>

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
            <button className="btn-primary btn-hover" onClick={downloadPDF}>
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
