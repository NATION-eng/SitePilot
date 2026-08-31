import React from 'react';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';

const MilestoneSchedule = ({ milestones, estimatedDurationMonths }) => {
  const { formatMoney } = useProject();

  if (!Array.isArray(milestones) || milestones.length === 0) return null;

  return (
    <div className="result-card slide-up" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div>
          <h3 className="result-card-title" style={{ margin: 0 }}>
            <Icon name="spreadsheet" size={20} color="var(--primary)" style={{ marginRight: '0.4rem' }} />
            Milestone Cashflow & Valuation Schedule
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Stage-by-stage QS disbursement valuations across 6 project milestones
          </p>
        </div>

        <div style={{ background: 'rgba(255, 107, 0, 0.12)', border: '1px solid rgba(255, 107, 0, 0.3)', borderRadius: '20px', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>
          ⏱️ Est. Timeline: {estimatedDurationMonths || '12'} Months
        </div>
      </div>

      <div className="milestones-timeline-grid">
        {milestones.map((m) => (
          <div key={m.id} className="milestone-item-card">
            <div className="milestone-item-header">
              <div className="milestone-badge">Phase {m.phase}</div>
              <div className="milestone-percent-pill">{m.percent}% of Budget</div>
            </div>

            <div className="milestone-title-row">
              <Icon name={m.icon || 'structure'} size={18} color="var(--primary)" />
              <h4 className="milestone-name">{m.name}</h4>
            </div>

            <p className="milestone-trades">{m.trades}</p>

            <div className="milestone-progress-track">
              <div className="milestone-progress-fill" style={{ width: `${m.percent}%` }} />
            </div>

            <div className="milestone-item-footer">
              <div className="milestone-duration">
                <Icon name="clock" size={13} color="var(--text-secondary)" />
                <span>~{m.durationMonths} Mos</span>
              </div>
              <div className="milestone-cost">
                {formatMoney(m.amount)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MilestoneSchedule;
