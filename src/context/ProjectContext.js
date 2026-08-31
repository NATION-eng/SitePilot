import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { useMultiStepForm } from '../hooks/useMultiStepForm';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { calculateConstructionCosts } from '../utils/pricingEngine';
import { getCurrencyInfo, getUnitInfo, formatCurrency, convertCurrency } from '../utils/currencyFormatter';
import PRICING_CONFIG from '../pricing.config.json';

const ProjectContext = createContext();

const defaultProjectData = {
  projectType: '',
  location: '',
  buildingSize: '',
  floors: '',
  specTier: 'standard',
  flooringType: 'ceramic',
  roofingType: 'aluminium',
  ceilingType: 'pop',
  foundationType: 'strip',
  selectedAddons: [],
  budget: '',
  timeline: '',
  notes: ''
};

export const ProjectProvider = ({ children }) => {
  const [view, setView] = useState('hero');
  const [projectData, setProjectData] = useLocalStorage('sitepilot-project', defaultProjectData);
  const [currency, setCurrency] = useLocalStorage('sitepilot-currency', 'NGN');
  const [unit, setUnit] = useLocalStorage('sitepilot-unit', 'sqm');
  const [materialPrices, setMaterialPrices] = useLocalStorage('sitepilot-custom-prices', PRICING_CONFIG.materials);
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
  } = useMultiStepForm(5); // 5-step workflow (1: Type, 2: Dimensions, 3: Specs, 4: Constraints, 5: Calculating)

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

  const toggleAddon = useCallback((addonKey) => {
    setProjectData(prev => {
      const currentAddons = Array.isArray(prev.selectedAddons) ? prev.selectedAddons : [];
      const updated = currentAddons.includes(addonKey)
        ? currentAddons.filter(k => k !== addonKey)
        : [...currentAddons, addonKey];
      return { ...prev, selectedAddons: updated };
    });
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
    goToStep(5);
    setError(null);
    announce('Calculating construction estimate. Please wait.');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      try {
        const results = calculateConstructionCosts(projectData, materialPrices);
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
        goToStep(4);
        announce(`Calculation error: ${err.message || 'Please try again.'}`);
      }
    }, 1800);
  }, [projectData, materialPrices, goToStep, announce]);

  const recalculateEstimate = useCallback((customPrices) => {
    if (projectData.buildingSize && parseFloat(projectData.buildingSize) > 0) {
      try {
        const results = calculateConstructionCosts(projectData, customPrices || materialPrices);
        if (results) {
          setAnalysisResults(results);
          announce('Estimate recalculated with updated material rates.');
        }
      } catch (err) {
        console.error('Recalculation error:', err);
      }
    }
  }, [projectData, materialPrices, announce]);

  const resetMaterialPrices = useCallback(() => {
    setMaterialPrices(PRICING_CONFIG.materials);
    recalculateEstimate(PRICING_CONFIG.materials);
    announce('Material prices reset to 2026 baseline rates.');
  }, [setMaterialPrices, recalculateEstimate, announce]);

  const currencyInfo = getCurrencyInfo(currency);
  const unitInfo = getUnitInfo(unit);

  const value = {
    view,
    currentStep,
    progress,
    isFirstStep,
    isLastStep,
    projectData,
    currency,
    setCurrency,
    currencyInfo,
    unit,
    setUnit,
    unitInfo,
    materialPrices,
    setMaterialPrices,
    resetMaterialPrices,
    recalculateEstimate,
    toggleAddon,
    formatMoney: (amountInNGN) => formatCurrency(amountInNGN, currency),
    convertMoney: (amountInNGN) => convertCurrency(amountInNGN, currency),
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
