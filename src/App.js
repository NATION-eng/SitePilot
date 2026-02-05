import React, { useState } from 'react';
import { styles, globalStyles } from './styles';
import Header from './components/Header';
import Hero from './components/Hero';
import FormContainer from './components/FormContainer';
import Results from './components/Results/Results';

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

    // SIMULATION: Calling internal mock generator
    // This allows the app to work beautifully without an API key or backend server.
    
    setTimeout(() => {
      const mockAnalysis = {
        materials: {
          cement: Math.floor(Math.random() * 500 + 500) + " bags",
          blocks: Math.floor(Math.random() * 5000 + 2000) + " pieces",
          steel: "2.5 tons",
          sand: "30 tons",
          gravel: "45 tons",
          roofing: "350 sqm"
        },
        costs: {
          materials: 8500000,
          labor: 2500000,
          equipment: 1200000,
          contingency: 1000000,
          total: 13200000
        },
        risk: {
          level: "Medium",
          budgetRisk: "Market volatility may affect cement prices.",
          timelineRisk: "Rainy season might delay foundation work."
        },
        warnings: ["Ensure soil test is conducted before foundation.", "Verify block quality."],
        recommendations: ["Use grade 42.5 cement for columns.", "Consider waterproofing admixture."]
      };

      setAnalysisResults(mockAnalysis);
      setIsLoading(false);
      setView('results');
    }, 2500); // 2.5s simulated delay
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
