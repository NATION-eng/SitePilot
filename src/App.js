import React, { useState, useRef, useEffect } from 'react';
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
  const [error, setError] = useState(null);
  const mainContentRef = useRef(null);
  
  const [projectData, setProjectData] = useState({
    projectType: '',
    location: '',
    buildingSize: '',
    floors: '',
    budget: '',
    timeline: '',
    notes: ''
  });

  // Focus management when view changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [view, currentStep]);

  const updateProjectData = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const startProject = () => {
    setView('form');
    setCurrentStep(1);
    setError(null);
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
    setError(null);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    setError(null);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError(null);
  };

  const generateAnalysis = async () => {
    setIsLoading(true);
    setCurrentStep(4);
    setError(null);

    // REAL CALCULATION: Using deterministic pricing engine
    // We simulate a small delay for UX purposes (loading state)
    
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
        console.error("Calculation failed:", err);
        setError(err.message || 'An unexpected error occurred. Please try again.');
        setIsLoading(false);
        setCurrentStep(3); // Return to previous step
      }
    }, 1500); 
  };

  return (
    <div style={styles.app}>
      <Header />
      
      <main 
        ref={mainContentRef} 
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
      >
        {view === 'hero' && (
          <section aria-labelledby="hero-title">
            <Hero onStart={startProject} />
          </section>
        )}
        
        {view === 'form' && (
          <section aria-labelledby="form-title">
            {error && (
              <div style={styles.errorState} role="alert">
                <div style={styles.errorIcon}>❌</div>
                <h3>Analysis Failed</h3>
                <p>{error}</p>
                <button 
                  style={styles.btnPrimary} 
                  onClick={() => {
                    setError(null);
                    setCurrentStep(3);
                  }}
                  className="btn-hover"
                >
                  Try Again
                </button>
              </div>
            )}
            {!error && (
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
          </section>
        )}
        
        {view === 'results' && analysisResults && (
          <section aria-labelledby="results-title">
            <Results
              projectData={projectData}
              analysis={analysisResults}
              onNewProject={resetProject}
            />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;

