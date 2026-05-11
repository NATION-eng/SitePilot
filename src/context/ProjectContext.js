import { createContext, useContext, useState, useCallback } from 'react';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateConstructionCosts } from '../utils/pricingEngine';

const ProjectContext = createContext();

const defaultProjectData = {
  projectType: '',
  location: '',
  buildingSize: '',
  floors: '',
  budget: '',
  timeline: '',
  notes: ''
};

export const ProjectProvider = ({ children }) => {
  const [view, setView] = useState('hero');
  const [projectData, setProjectData] = useLocalStorage('sitepilot-project', defaultProjectData);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    currentStep,
    nextStep: stepForward,
    prevStep: stepBack,
    goToStep,
    reset: resetSteps,
    progress,
    isFirstStep,
    isLastStep
  } = useMultiStepForm(4);

  const updateProjectData = useCallback((field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  }, [setProjectData]);

  const startProject = useCallback(() => {
    setView('form');
    resetSteps();
    setError(null);
  }, [resetSteps]);

  const resetProject = useCallback(() => {
    setView('hero');
    resetSteps();
    setProjectData(defaultProjectData);
    setAnalysisResults(null);
    setError(null);
    try { window.localStorage.removeItem('sitepilot-project'); } catch (e) { /* silent */ }
  }, [resetSteps, setProjectData]);

  const nextStep = useCallback(() => {
    stepForward();
    setError(null);
  }, [stepForward]);

  const prevStep = useCallback(() => {
    stepBack();
    setError(null);
  }, [stepBack]);

  const generateAnalysis = useCallback(() => {
    setIsLoading(true);
    goToStep(4);
    setError(null);

    setTimeout(() => {
      try {
        const results = calculateConstructionCosts(projectData);
        if (!results) {
          throw new Error('Unable to calculate costs. Please check your inputs.');
        }
        setAnalysisResults(results);
        setIsLoading(false);
        setView('results');
      } catch (err) {
        console.error('Calculation failed:', err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
        setIsLoading(false);
        goToStep(3);
      }
    }, 1500);
  }, [projectData, goToStep]);

  const value = {
    view,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    projectData,
    analysisResults,
    isLoading,
    error,
    setError,
    updateProjectData,
    startProject,
    resetProject,
    nextStep,
    prevStep,
    generateAnalysis
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
