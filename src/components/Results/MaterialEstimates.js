import React from 'react';

const MaterialEstimates = ({ materials }) => (
  <div className="result-card">
    <h3 className="result-card-title">
      <span className="card-icon">📦</span> Material Estimates
    </h3>
    {Object.entries(materials).map(([key, value]) => (
      <div key={key} className="material-item">
        <span className="material-name">
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </span>
        <span className="material-quantity">{value}</span>
      </div>
    ))}
  </div>
);

export default MaterialEstimates;
