import React, { useRef } from 'react';
import { styles } from '../../styles';
import MaterialEstimates from './MaterialEstimates';
import CostAnalysis from './CostAnalysis';
import RiskAssessment from './RiskAssessment';
import Recommendations from './Recommendations';
import html2pdf from 'html2pdf.js';

const Results = ({ projectData, analysis, onNewProject }) => {
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
        backgroundColor: '#141921', // Force dark background
        logging: true
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div style={styles.resultsContainer} className="fade-in">
      <div style={styles.container}>
        <div style={styles.formCard} className="slide-up" ref={contentRef}>
          <div style={styles.aiBadge}>
            <span>🤖</span>
            <span>AI-Generated Analysis</span>
          </div>

          <h2 style={styles.sectionTitle}>
            {projectData.projectType.charAt(0).toUpperCase() + projectData.projectType.slice(1)} Project Analysis
          </h2>
          <p style={styles.sectionSubtitle}>
            {projectData.buildingSize} sqm • {projectData.floors} floors • {projectData.location}
          </p>

          {analysis.warnings && analysis.warnings.length > 0 && (
            <div>
              {analysis.warnings.map((warning, idx) => (
                <div key={idx} className="slide-up" style={{...styles.alert, animationDelay: `${idx * 0.1}s`}}>
                  <div style={styles.alertIcon}>⚠️</div>
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

          <div style={{...styles.buttonGroup, marginTop: '2rem'}} data-html2canvas-ignore="true">
            <button style={styles.btnSecondary} onClick={onNewProject} className="btn-hover">New Project</button>
            <button style={styles.btnPrimary} onClick={downloadPDF} className="btn-hover">Download PDF Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
