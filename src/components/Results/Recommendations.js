import React from 'react';

const Recommendations = ({ recommendations }) => (
  <div className="result-card">
    <h3 className="result-card-title">
      <span className="card-icon">💡</span> AI Recommendations
    </h3>
    {recommendations.map((rec, idx) => (
      <div key={idx} className="material-item">
        <span className="rec-number">{idx + 1}.</span>
        <span>{rec}</span>
      </div>
    ))}
  </div>
);

export default Recommendations;
