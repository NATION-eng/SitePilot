import React from 'react';
import { styles } from '../styles';

const ProgressBar = ({ currentStep }) => {
  const progress = ((currentStep - 1) / 3) * 100;
  
  return (
    <div style={styles.progressContainer}>
      <div style={styles.progressBar}>
        <div style={styles.progressBarBg} />
        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        {[1, 2, 3, 4].map(step => (
          <div
            key={step}
            style={{
              ...styles.step,
              ...(step < currentStep ? styles.stepCompleted : {}),
              ...(step === currentStep ? styles.stepActive : {})
            }}
          >
            {step < currentStep ? '✓' : step}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
