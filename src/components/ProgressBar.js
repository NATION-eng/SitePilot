import React from 'react';
import { useProject } from '../context/ProjectContext';

const ProgressBar = () => {
  const { currentStep, progress } = useProject();
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div className="progress-bar-bg" />
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        {[1, 2, 3, 4].map(step => (
          <div
            key={step}
            className={`step ${step < currentStep ? 'step-completed' : ''} ${step === currentStep ? 'step-active' : ''}`}
          >
            {step < currentStep ? '✓' : step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
