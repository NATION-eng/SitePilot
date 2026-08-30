import React from 'react';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';

const RiskAssessment = ({ risk }) => {
  const { formatMoney } = useProject();

  if (!risk) return null;

  // Generate dynamic budget risk text in active currency
  let dynamicBudgetRisk = risk.budgetRisk;
  if (risk.budgetAmount && risk.budgetAmount > 0 && risk.budgetDiff !== undefined) {
    const diff = Math.abs(risk.budgetDiff);
    const pct = Math.abs(risk.budgetDiffPercent || 0);

    if (risk.budgetDiff > 0) {
      dynamicBudgetRisk = `Your budget is ${formatMoney(diff)} above the estimated cost (${pct}% surplus). Good financial buffer for unexpected project contingencies.`;
    } else if (risk.budgetDiff < 0) {
      dynamicBudgetRisk = `Your budget is ${formatMoney(diff)} below the estimated cost (${pct}% shortfall). Consider increasing budget or phasing interior finishes.`;
    } else {
      dynamicBudgetRisk = `Your budget matches the estimated cost exactly. Consider adding a 10–15% contingency buffer.`;
    }
  }

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
      <p className="risk-description">{dynamicBudgetRisk}</p>
      <div className="material-item">
        <span className="risk-section-label">Timeline Evaluation</span>
      </div>
      <p className="risk-description">{risk.timelineRisk}</p>
    </div>
  );
};

export default RiskAssessment;
