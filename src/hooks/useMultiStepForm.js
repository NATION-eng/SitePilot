import { useState } from 'react';

export const useMultiStepForm = (totalSteps = 4) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const goToStep = (step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  };

  const reset = () => {
    setCurrentStep(1);
  };

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    reset,
    progress,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps
  };
};
