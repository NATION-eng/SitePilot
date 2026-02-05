import React from 'react';
import { styles } from '../../styles';

const MaterialEstimates = ({ materials }) => (
  <div style={styles.resultCard}>
    <h3 style={styles.resultCardTitle}>
      <span style={styles.cardIcon}>📦</span> Material Estimates
    </h3>
    {Object.entries(materials).map(([key, value]) => (
      <div key={key} style={styles.materialItem}>
        <span style={styles.materialName}>
          {key.charAt(0).toUpperCase() + key.slice(1)}
        </span>
        <span style={styles.materialQuantity}>{value}</span>
      </div>
    ))}
  </div>
);

export default MaterialEstimates;
