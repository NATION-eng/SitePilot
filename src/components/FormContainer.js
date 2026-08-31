import React from 'react';
import ProgressBar from './ProgressBar';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepSpecs from './Steps/StepSpecs';
import StepThree from './Steps/StepThree';
import LoadingStep from './Steps/LoadingStep';
import { useProject } from '../context/ProjectContext';

const FormContainer = () => {
  const { currentStep } = useProject();

  return (
    <div className="app-container">
      <div className="container">
        <ProgressBar />
        
        <div className="form-card">
          {currentStep === 1 && <StepOne />}
          {currentStep === 2 && <StepTwo />}
          {currentStep === 3 && <StepSpecs />}
          {currentStep === 4 && <StepThree />}
          {currentStep === 5 && <LoadingStep />}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
