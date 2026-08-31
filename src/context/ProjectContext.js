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
  regionKey: 'lagos_island',
  buildingSize: '',
  floors: '',
  specTier: 'standard',
  flooringType: 'ceramic',
  roofingType: 'aluminium',
  ceilingType: 'pop',
  foundationType: 'strip',
  selectedAddons: [],
  customMaterials: [],
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
  const [savedProjects, setSavedProjects] = useLocalStorage('sitepilot-saved-portfolio', []);
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

  const addCustomMaterial = useCallback((item = {}) => {
    const newItem = {
      id: `cm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: item.name || '',
      unit: item.unit || 'sqm',
      quantity: item.quantity !== undefined ? item.quantity : '',
      unitPrice: item.unitPrice !== undefined ? item.unitPrice : ''
    };
    setProjectData(prev => ({
      ...prev,
      customMaterials: [...(prev.customMaterials || []), newItem]
    }));
  }, [setProjectData]);

  const updateCustomMaterial = useCallback((id, field, value) => {
    setProjectData(prev => ({
      ...prev,
      customMaterials: (prev.customMaterials || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  }, [setProjectData]);

  const removeCustomMaterial = useCallback((id) => {
    setProjectData(prev => ({
      ...prev,
      customMaterials: (prev.customMaterials || []).filter(item => item.id !== id)
    }));
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
        }
      } catch (err) {
        console.error('Recalculation error:', err);
      }
    }
  }, [projectData, materialPrices]);

  const resetMaterialPrices = useCallback(() => {
    setMaterialPrices(PRICING_CONFIG.materials);
    try {
      window.localStorage.removeItem('sitepilot-custom-prices');
    } catch (e) { /* silent */ }
    recalculateEstimate(PRICING_CONFIG.materials);
  }, [setMaterialPrices, recalculateEstimate]);

  // --- Multi-Project Portfolio Management ---
  const saveCurrentProject = useCallback((customTitle = '') => {
    if (!projectData.buildingSize) return null;
    const currentResults = analysisResults || calculateConstructionCosts(projectData, materialPrices);
    const projectId = `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const title = customTitle.trim() || `${(projectData.projectType || 'Project').toUpperCase()} • ${projectData.location || 'Site'}`;

    const newProjectRecord = {
      id: projectId,
      title,
      date: new Date().toISOString(),
      projectData: { ...projectData },
      currency,
      unit,
      totalCost: currentResults?.costs?.total || 0,
      specTier: projectData.specTier || 'standard'
    };

    setSavedProjects(prev => [newProjectRecord, ...prev.filter(p => p.id !== projectId)]);
    announce(`Project "${title}" saved to your portfolio.`);
    return projectId;
  }, [projectData, analysisResults, materialPrices, currency, unit, setSavedProjects, announce]);

  const loadSavedProject = useCallback((projectId) => {
    const found = savedProjects.find(p => p.id === projectId);
    if (!found) return false;

    setProjectData(found.projectData);
    if (found.currency) setCurrency(found.currency);
    if (found.unit) setUnit(found.unit);

    const recomputed = calculateConstructionCosts(found.projectData, materialPrices);
    setAnalysisResults(recomputed);
    setView('results');
    announce(`Loaded project "${found.title}".`);
    return true;
  }, [savedProjects, materialPrices, setProjectData, setCurrency, setUnit, announce]);

  const deleteSavedProject = useCallback((projectId) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    announce('Project removed from portfolio.');
  }, [setSavedProjects, announce]);

  const duplicateSavedProject = useCallback((projectId) => {
    const found = savedProjects.find(p => p.id === projectId);
    if (!found) return;

    const duplicated = {
      ...found,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: `${found.title} (Copy)`,
      date: new Date().toISOString()
    };

    setSavedProjects(prev => [duplicated, ...prev]);
    announce(`Duplicated "${found.title}".`);
  }, [savedProjects, setSavedProjects, announce]);

  const formatMoney = useCallback((amountInNGN) => {
    return formatCurrency(amountInNGN, currency);
  }, [currency]);

  const convertMoney = useCallback((amountInNGN) => {
    return convertCurrency(amountInNGN, currency);
  }, [currency]);

  const currencyInfo = getCurrencyInfo(currency);
  const unitInfo = getUnitInfo(unit);

  const value = {
    view,
    setView,
    projectData,
    updateProjectData,
    toggleAddon,
    addCustomMaterial,
    updateCustomMaterial,
    removeCustomMaterial,
    currency,
    setCurrency,
    currencyInfo,
    currencyData: currencyInfo,
    formatMoney,
    convertMoney,
    unit,
    setUnit,
    unitInfo,
    unitData: unitInfo,
    materialPrices,
    setMaterialPrices,
    resetMaterialPrices,
    recalculateEstimate,
    savedProjects,
    saveCurrentProject,
    loadSavedProject,
    deleteSavedProject,
    duplicateSavedProject,
    analysisResults,
    isLoading,
    error,
    setError,
    announcement,
    announce,
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    progress,
    isFirstStep,
    isLastStep,
    startProject,
    resetProject,
    generateAnalysis,
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
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
