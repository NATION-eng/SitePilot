import React from 'react';
import { styles } from '../../styles';

const Recommendations = ({ recommendations }) => (
  <div style={styles.resultCard}>
    <h3 style={styles.resultCardTitle}>
      <span style={styles.cardIcon}>💡</span> AI Recommendations
    </h3>
    {recommendations.map((rec, idx) => (
      <div key={idx} style={styles.materialItem}>
        <span style={{ color: '#FF6B00', fontWeight: 700, marginRight: '0.5rem' }}>
          {idx + 1}.
        </span>
        <span>{rec}</span>
      </div>
    ))}
  </div>
);

export default Recommendations;
