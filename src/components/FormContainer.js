import React from 'react';
import { styles } from '../styles';
import ProgressBar from './ProgressBar';
import StepOne from './Steps/StepOne';
import StepTwo from './Steps/StepTwo';
import StepThree from './Steps/StepThree';
import LoadingStep from './Steps/LoadingStep';

const FormContainer = ({
  currentStep,
  projectData,
  updateProjectData,
  nextStep,
  prevStep,
  resetProject,
  generateAnalysis,
  isLoading
}) => (
  <div style={styles.appContainer}>
    <div style={styles.container}>
      <ProgressBar currentStep={currentStep} />
      
      <div style={styles.formCard}>
        {currentStep === 1 && (
          <StepOne
            projectData={projectData}
            updateProjectData={updateProjectData}
            nextStep={nextStep}
            resetProject={resetProject}
          />
        )}
        
        {currentStep === 2 && (
          <StepTwo
            projectData={projectData}
            updateProjectData={updateProjectData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        )}
        
        {currentStep === 3 && (
          <StepThree
            projectData={projectData}
            updateProjectData={updateProjectData}
            prevStep={prevStep}
            generateAnalysis={generateAnalysis}
          />
        )}
        
        {currentStep === 4 && <LoadingStep />}
      </div>
    </div>
  </div>
);

export default FormContainer;
