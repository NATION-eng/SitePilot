import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
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
  const [announcement, setAnnouncement] = useState('');
  const timeoutRef = useRef(null);

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

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const updateProjectData = useCallback((field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  }, [setProjectData]);

  const announce = useCallback((msg) => {
    setAnnouncement(msg);
  }, []);

  const startProject = useCallback(() => {
    setView('form');
    resetSteps();
    setError(null);
    announce('Started new project form. Step 1: Select project type.');
  }, [resetSteps, announce]);

  const resetProject = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setView('hero');
    resetSteps();
    setProjectData(defaultProjectData);
    setAnalysisResults(null);
    setError(null);
    setIsLoading(false);
    announce('Project reset. Returned to homepage.');
    try { window.localStorage.removeItem('sitepilot-project'); } catch (e) { /* silent */ }
  }, [resetSteps, setProjectData, announce]);

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
    announce('Calculating construction estimate. Please wait.');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const results = calculateConstructionCosts(projectData);
        if (!results) {
          throw new Error('Unable to calculate costs. Please check that building size and floor numbers are valid.');
        }
        setAnalysisResults(results);
        setIsLoading(false);
        setView('results');
        announce('Estimate calculation complete. Displaying results report.');
      } catch (err) {
        console.error('Calculation failed:', err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
        setIsLoading(false);
        goToStep(3);
        announce(`Calculation error: ${err.message || 'Please try again.'}`);
      }
    }, 1800);
  }, [projectData, goToStep, announce]);

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
    announcement,
    announce,
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
