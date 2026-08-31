import React from 'react';
import { useProject } from '../context/ProjectContext';
import Icon from './ui/Icon';

const STEP_LABELS = ['Type', 'Dimensions', 'Specs', 'Budget', 'Review'];

const ProgressBar = () => {
  const { currentStep, progress } = useProject();
  
  return (
    <div className="progress-container" aria-label="Estimate Progress">
      <div className="progress-bar">
        <div className="progress-bar-bg" />
        <div className="progress-fill" style={{ width: `${progress}%` }} />
        {[1, 2, 3, 4, 5].map((step, idx) => (
          <div
            key={step}
            className={`step ${step < currentStep ? 'step-completed' : ''} ${step === currentStep ? 'step-active' : ''}`}
            title={`Step ${step}: ${STEP_LABELS[idx]}`}
          >
            {step < currentStep ? (
              <Icon name="check" size={14} color="#fff" />
            ) : (
              step
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
