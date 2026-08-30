import React from 'react';
import Icon from '../ui/Icon';
import { useProject } from '../../context/ProjectContext';

const Recommendations = ({ recommendations }) => {
  const { analysisResults, formatMoney } = useProject();

  if (!recommendations) return null;

  const shortfall = analysisResults?.shortfallAmount || 0;

  // Build recommendation list dynamically
  const displayRecs = [...recommendations];
  if (shortfall > 0) {
    const dynamicShortfallRec = `Budget shortfall of ${formatMoney(shortfall)} — prioritise foundation and structural elements over finishing touches.`;
    // Replace first recommendation if it is a shortfall message or unshift
    if (displayRecs[0] && displayRecs[0].toLowerCase().includes('shortfall')) {
      displayRecs[0] = dynamicShortfallRec;
    } else {
      displayRecs.unshift(dynamicShortfallRec);
    }
  }

  return (
    <div className="result-card">
      <h3 className="result-card-title">
        <Icon name="lightbulb" size={22} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Expert Recommendations
      </h3>
      {displayRecs.map((rec, idx) => (
        <div key={idx} className="material-item">
          <span className="rec-number">{idx + 1}.</span>
          <span className="recommendation-text">{rec}</span>
        </div>
      ))}
    </div>
  );
};

export default Recommendations;
