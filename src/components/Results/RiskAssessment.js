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

      <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <Icon name="coins" size={15} color="var(--primary)" /> Budget Evaluation
          </div>
          <p className="risk-description" style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.5' }}>{dynamicBudgetRisk}</p>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.85rem 1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.4rem' }}>
            <Icon name="clock" size={15} color="var(--primary)" /> Timeline Evaluation
          </div>
          <p className="risk-description" style={{ margin: 0, fontSize: '0.86rem', lineHeight: '1.5' }}>{risk.timelineRisk}</p>
        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
