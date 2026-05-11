import React from 'react';

const LoadingStep = () => (
  <div className="loading">
    <div className="spinner" />
    <h3 style={{ marginBottom: '0.5rem' }}>Analyzing Your Project...</h3>
    <p className="loading-subtitle">AI is calculating materials, costs, and risk factors</p>
  </div>
);

export default LoadingStep;
