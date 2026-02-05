import React, { useState } from 'react';
import { styles, globalStyles } from './styles';
import Header from './components/Header';
import Hero from './components/Hero';
import FormContainer from './components/FormContainer';
import Results from './components/Results/Results';
import { calculateConstructionCosts } from './utils/pricingEngine';

// Inject global styles
const styleSheet = document.createElement("style");
styleSheet.innerText = globalStyles;
document.head.appendChild(styleSheet);

function App() {
  const [view, setView] = useState('hero'); // 'hero', 'form', 'results'
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  
  const [projectData, setProjectData] = useState({
    projectType: '',
    location: '',
    buildingSize: '',
    floors: '',
    budget: '',
    timeline: '',
    notes: ''
  });

  const updateProjectData = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const startProject = () => {
    setView('form');
    setCurrentStep(1);
  };

  const resetProject = () => {
    setView('hero');
    setCurrentStep(1);
    setProjectData({
      projectType: '',
      location: '',
      buildingSize: '',
      floors: '',
      budget: '',
      timeline: '',
      notes: ''
    });
    setAnalysisResults(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    setCurrentStep(4);

    // REAL CALCULATION: Using deterministic pricing engine
    // We simulate a small delay for UX purposes (loading state)
    
    setTimeout(() => {
      try {
        const results = calculateConstructionCosts(projectData);
        
        if (!results) {
          // Handle error or invalid data
          console.error("Calculation returned null");
        }
        
        setAnalysisResults(results);
        setIsLoading(false);
        setView('results');
      } catch (error) {
        console.error("Calculation failed:", error);
        setIsLoading(false);
      }
    }, 1500); 
  };

  return (
    <div style={styles.app}>
      <Header />
      
      {view === 'hero' && <Hero onStart={startProject} />}
      
      {view === 'form' && (
        <FormContainer
          currentStep={currentStep}
          projectData={projectData}
          updateProjectData={updateProjectData}
          nextStep={nextStep}
          prevStep={prevStep}
          resetProject={resetProject}
          generateAnalysis={generateAnalysis}
          isLoading={isLoading}
        />
      )}
      
      {view === 'results' && analysisResults && (
        <Results
          projectData={projectData}
          analysis={analysisResults}
          onNewProject={resetProject}
        />
      )}
    </div>
  );
}

export default App;
