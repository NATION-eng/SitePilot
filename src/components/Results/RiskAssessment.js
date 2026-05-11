import React from 'react';

const RiskAssessment = ({ risk }) => {
  return (
    <div className="result-card">
      <h3 className="result-card-title">
        <span className="card-icon">⚠️</span> Risk Assessment
      </h3>
      <div className={`risk-badge risk-${risk.level.toLowerCase()}`}>
        {risk.level} Risk
      </div>
      <div className="material-item">
        <span className="risk-section-label">Budget Risk</span>
      </div>
      <p className="risk-description">{risk.budgetRisk}</p>
      <div className="material-item">
        <span className="risk-section-label">Timeline Risk</span>
      </div>
      <p className="risk-description">{risk.timelineRisk}</p>
    </div>
  );
};

export default RiskAssessment;
