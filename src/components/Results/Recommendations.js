import React from 'react';
import Icon from '../ui/Icon';

const Recommendations = ({ recommendations }) => {
  if (!recommendations) return null;

  return (
    <div className="result-card">
      <h3 className="result-card-title">
        <Icon name="lightbulb" size={22} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Expert Recommendations
      </h3>
      {recommendations.map((rec, idx) => (
        <div key={idx} className="material-item">
          <span className="rec-number">{idx + 1}.</span>
          <span>{rec}</span>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
