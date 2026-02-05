import React from 'react';
import { styles } from '../../styles';

const RiskAssessment = ({ risk }) => {
  const riskStyles = {
    Low: styles.riskLow,
    Medium: styles.riskMedium,
    High: styles.riskHigh
  };

  return (
    <div style={styles.resultCard}>
      <h3 style={styles.resultCardTitle}>
        <span style={styles.cardIcon}>⚠️</span> Risk Assessment
      </h3>
      <div style={{ ...styles.riskBadge, ...riskStyles[risk.level] }}>
        {risk.level} Risk
      </div>
      <div style={styles.materialItem}>
        <span style={styles.materialName}>Budget Risk</span>
      </div>
      <p style={{ color: '#8B95A5', marginBottom: '1rem' }}>{risk.budgetRisk}</p>
      <div style={styles.materialItem}>
        <span style={styles.materialName}>Timeline Risk</span>
      </div>
      <p style={{ color: '#8B95A5' }}>{risk.timelineRisk}</p>
    </div>
  );
};

export default RiskAssessment;
