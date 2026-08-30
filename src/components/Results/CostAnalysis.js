import React, { useState } from 'react';
import CostChart from './CostChart';

const CostAnalysis = ({ costs, currencySymbol = '₦' }) => {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'table'

  if (!costs) return null;

  return (
    <div className="result-card">
      <div className="card-header-with-toggle">
        <h3 className="result-card-title" style={{ marginBottom: 0 }}>
          <span className="card-icon">💰</span> Cost Breakdown
        </h3>
        
        <div className="view-toggle" role="tablist" aria-label="Cost view mode">
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'chart'}
            className={`toggle-btn ${viewMode === 'chart' ? 'toggle-btn-active' : ''}`}
            onClick={() => setViewMode('chart')}
          >
            📊 Chart
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={viewMode === 'table'}
            className={`toggle-btn ${viewMode === 'table' ? 'toggle-btn-active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            📋 Items
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <CostChart costs={costs} currencySymbol={currencySymbol} />
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
                <span className="material-quantity">{currencySymbol}{value.toLocaleString()}</span>
              </div>
            ))}
        </div>
      )}

      <div className="total-cost">
        <div className="total-cost-label">Estimated Total Project Cost</div>
        <div className="total-cost-amount">{currencySymbol}{costs.total.toLocaleString()}</div>
      </div>
    </div>
  );
};

export default CostAnalysis;
