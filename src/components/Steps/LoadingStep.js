import React, { useState, useEffect } from 'react';

const STAGES = [
  'Calculating foundation & structural materials...',
  'Computing finishes, doors, windows & MEP services...',
  'Analyzing budget alignment & timeline risks...',
  'Finalizing estimate report...'
];

const LoadingStep = () => {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1.4rem' }}>Generating Project Estimate</h3>
      <p className="loading-subtitle" style={{ minHeight: '1.5rem', transition: 'all 0.3s ease' }}>
        {STAGES[stageIndex]}
      </p>
    </div>
  );
};

export default LoadingStep;
