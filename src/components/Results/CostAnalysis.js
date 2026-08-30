import React, { useState } from 'react';
import CostChart from './CostChart';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';

const CostAnalysis = ({ costs }) => {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'
  const { formatMoney } = useProject();

  if (!costs) return null;

  return (
    <div className="result-card">
      <div className="card-header-with-toggle">
        <h3 className="result-card-title" style={{ marginBottom: 0 }}>
          <Icon name="coins" size={22} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Cost Breakdown
        </h3>
        
        <div className="view-toggle" role="tablist" aria-label="Cost view mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'chart'}
            className={`toggle-btn ${viewMode === 'chart' ? 'toggle-btn-active' : ''}`}
            onClick={() => setViewMode('chart')}
          >
            <Icon name="chart" size={14} style={{ marginRight: '0.3rem' }} /> Chart
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'table'}
            className={`toggle-btn ${viewMode === 'table' ? 'toggle-btn-active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <Icon name="table" size={14} style={{ marginRight: '0.3rem' }} /> Items
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <CostChart costs={costs} />
      ) : (
        <div className="cost-items-list fade-in" style={{ marginTop: '1rem' }}>
          {Object.entries(costs)
            .filter(([key]) => key !== 'total')
            .map(([key, value]) => (
              <div key={key} className="material-item">
                <span className="material-name">
                  {key === 'm_e_p'
                    ? 'MEP (Mechanical/Electrical/Plumbing)'
                    : key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="material-quantity">{formatMoney(value)}</span>
              </div>
            ))}
        </div>
      )}

      <div className="total-cost">
        <div className="total-cost-label">Estimated Total Project Cost</div>
        <div className="total-cost-amount">{formatMoney(costs.total)}</div>
      </div>
    </div>
  );
};

export default CostAnalysis;
