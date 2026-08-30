import React from 'react';
import Icon from '../ui/Icon';

const RiskAssessment = ({ risk }) => {
  if (!risk) return null;

  return (
    <div className="result-card">
      <h3 className="result-card-title">
        <Icon name="warning" size={22} color="var(--warning)" style={{ marginRight: '0.4rem' }} /> Risk Assessment
      </h3>
      <div className={`risk-badge risk-${(risk.level || 'medium').toLowerCase()}`}>
        {risk.level} Risk
      </div>
      <div className="material-item">
        <span className="risk-section-label">Budget Evaluation</span>
      </div>
      <p className="risk-description">{risk.budgetRisk}</p>
      <div className="material-item">
        <span className="risk-section-label">Timeline Evaluation</span>
      </div>
      <p className="risk-description">{risk.timelineRisk}</p>
    </div>
  );
};

export default RiskAssessment;
