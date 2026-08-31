import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';

const SCENARIO_THEMES = {
  optimistic: { color: '#00D9A3', bg: 'rgba(0, 217, 163, 0.1)', border: 'rgba(0, 217, 163, 0.3)', badge: 'Deflation / Discount' },
  base: { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', badge: 'Baseline 2026' },
  moderate_inflation: { color: '#FFB800', bg: 'rgba(255, 184, 0, 0.1)', border: 'rgba(255, 184, 0, 0.3)', badge: '+15% Inflation' },
  severe_surge: { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', badge: '+30% Surge' }
};

const StressTestMatrix = ({ stressTests, baseTotal, budget }) => {
  const { formatMoney } = useProject();
  const [activeKey, setActiveKey] = useState('base');

  if (!stressTests || Object.keys(stressTests).length === 0) return null;

  const currentScenario = stressTests[activeKey] || stressTests.base;
  const currentTheme = SCENARIO_THEMES[activeKey] || SCENARIO_THEMES.base;
  const costDiff = currentScenario.totalCost - (baseTotal || currentScenario.totalCost);

  return (
    <div className="result-card slide-up" style={{ marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <div>
          <h3 className="result-card-title" style={{ margin: 0 }}>
            <Icon name="chart" size={20} color="var(--primary)" style={{ marginRight: '0.4rem' }} />
            Market Inflation Stress-Testing Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
            Simulate FX devaluation and material inflation scenarios on your project budget
          </p>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div className="stress-test-selector">
        {Object.entries(stressTests).map(([key, s]) => {
          const theme = SCENARIO_THEMES[key] || SCENARIO_THEMES.base;
          const isSelected = activeKey === key;

          return (
            <button
              key={key}
              type="button"
              className={`stress-pill-btn ${isSelected ? 'stress-pill-active' : ''}`}
              style={{
                borderColor: isSelected ? theme.color : 'var(--border)',
                backgroundColor: isSelected ? theme.bg : 'var(--bg-elevated)'
              }}
              onClick={() => setActiveKey(key)}
            >
              <span className="stress-pill-badge" style={{ color: theme.color }}>
                {s.variancePercent > 0 ? `+${s.variancePercent}%` : `${s.variancePercent}%`}
              </span>
              <span className="stress-pill-name">{s.name.split(' (')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Evaluation Card */}
      <div
        className="stress-test-active-card"
        style={{
          backgroundColor: currentTheme.bg,
          borderColor: currentTheme.border
        }}
      >
        <div className="stress-card-header">
          <div>
            <span className="stress-card-tag" style={{ color: currentTheme.color }}>
              {currentScenario.name}
            </span>
            <p className="stress-card-desc">{currentScenario.description}</p>
          </div>
          <div className="stress-card-cost" style={{ color: currentTheme.color }}>
            {formatMoney(currentScenario.totalCost)}
          </div>
        </div>

        <div className="stress-card-metrics">
          <div className="stress-metric">
            <span className="stress-metric-label">Variance vs Baseline:</span>
            <strong style={{ color: costDiff > 0 ? '#EF4444' : costDiff < 0 ? '#00D9A3' : 'var(--text-primary)' }}>
              {costDiff > 0 ? `+${formatMoney(costDiff)}` : costDiff < 0 ? `-${formatMoney(Math.abs(costDiff))}` : '0.00 (Exact)'}
            </strong>
          </div>

          {budget && parseFloat(budget) > 0 && (
            <div className="stress-metric">
              <span className="stress-metric-label">Budget Resilience:</span>
              <strong style={{ color: currentScenario.budgetSurplus ? '#00D9A3' : '#EF4444' }}>
                {currentScenario.budgetSurplus
                  ? `Surplus: +${formatMoney(currentScenario.budgetDiff)}`
                  : `Shortfall: -${formatMoney(Math.abs(currentScenario.budgetDiff))}`}
              </strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StressTestMatrix;
