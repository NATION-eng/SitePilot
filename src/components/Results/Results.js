import React, { useRef } from 'react';
import MaterialEstimates from './MaterialEstimates';
import CostAnalysis from './CostAnalysis';
import RiskAssessment from './RiskAssessment';
import Recommendations from './Recommendations';
import { useProject } from '../../context/ProjectContext';
import html2pdf from 'html2pdf.js';

const Results = () => {
  const { projectData, analysisResults: analysis, resetProject } = useProject();
  const contentRef = useRef(null);

  const downloadPDF = () => {
    const element = contentRef.current;
    const opt = {
      margin: 0.5,
      filename: `SitePilot_Analysis_${projectData.projectType}_${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#141921',
        logging: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="results-container fade-in">
      <div className="container">
        <div className="form-card slide-up" ref={contentRef}>
          <div className="ai-badge">
            <span>🏡</span>
            <span>AI-Generated Analysis</span>
          </div>

          <h2 className="section-title">
            {projectData.projectType.charAt(0).toUpperCase() + projectData.projectType.slice(1)} Project Analysis
          </h2>
          <p className="section-subtitle">
            {projectData.buildingSize} sqm • {projectData.floors} floors • {projectData.location}
          </p>

          {analysis.warnings && analysis.warnings.length > 0 && (
            <div>
              {analysis.warnings.map((warning, idx) => (
                <div key={idx} className="alert slide-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="alert-icon">⚠️</div>
                  <div>{warning}</div>
                </div>
              ))}
            </div>
          )}

          <div className="responsive-grid-2 slide-up" style={{ animationDelay: '0.3s' }}>
            <MaterialEstimates materials={analysis.materials} />
            <CostAnalysis costs={analysis.costs} />
            <RiskAssessment risk={analysis.risk} />
            <Recommendations recommendations={analysis.recommendations} />
          </div>

          <div className="button-group" style={{ marginTop: '2rem' }} data-html2canvas-ignore="true">
            <button className="btn-secondary btn-hover" onClick={resetProject}>New Project</button>
            <button className="btn-primary btn-hover" onClick={downloadPDF}>Download PDF Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
