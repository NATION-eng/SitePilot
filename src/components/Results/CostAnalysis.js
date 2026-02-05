import React from 'react';
import { styles } from '../../styles';

const CostAnalysis = ({ costs }) => (
  <div style={styles.resultCard}>
    <h3 style={styles.resultCardTitle}>
      <span style={styles.cardIcon}>💰</span> Cost Analysis
    </h3>
    {Object.entries(costs)
      .filter(([key]) => key !== 'total')
      .map(([key, value]) => (
        <div key={key} style={styles.materialItem}>
          <span style={styles.materialName}>
            {key === 'm_e_p' ? 'MEP (Services)' : key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
          <span style={styles.materialQuantity}>₦{value.toLocaleString()}</span>
        </div>
      ))}
    <div style={styles.totalCost}>
      <div style={styles.totalCostLabel}>Estimated Total Cost</div>
      <div style={styles.totalCostAmount}>₦{costs.total.toLocaleString()}</div>
    </div>
  </div>
);

export default CostAnalysis;
