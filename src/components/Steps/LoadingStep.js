import React from 'react';
import { styles } from '../../styles';

const LoadingStep = () => (
  <div style={styles.loading}>
    <div style={styles.spinner} />
    <h3 style={{ marginBottom: '0.5rem' }}>Analyzing Your Project...</h3>
    <p style={{ color: '#8B95A5' }}>AI is calculating materials, costs, and risk factors</p>
  </div>
);

export default LoadingStep;
