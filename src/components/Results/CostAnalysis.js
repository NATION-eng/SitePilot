import React from 'react';

const CostAnalysis = ({ costs }) => (
  <div className="result-card">
    <h3 className="result-card-title">
      <span className="card-icon">💰</span> Cost Analysis
    </h3>
    {Object.entries(costs)
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => (
        <div key={key} className="material-item">
          <span className="material-name">
            {key === 'm_e_p' ? 'MEP (Services)' : key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          <span className="material-quantity">₦{value.toLocaleString()}</span>
        </div>
      ))}
    <div className="total-cost">
      <div className="total-cost-label">Estimated Total Cost</div>
      <div className="total-cost-amount">₦{costs.total.toLocaleString()}</div>
    </div>
  </div>
);

export default CostAnalysis;
