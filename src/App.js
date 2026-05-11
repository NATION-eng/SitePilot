import React, { useRef, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import FormContainer from './components/FormContainer';
import Results from './components/Results/Results';
import SEO from './components/SEO';
import { useProject } from './context/ProjectContext';

const seoConfig = {
  hero: { title: 'Home', description: 'AI-powered construction intelligence — estimate materials, predict costs, and detect risks before breaking ground.' },
  form: { title: 'New Project', description: 'Enter your construction project details for an AI-powered cost analysis.' },
  results: { title: 'Project Analysis', description: 'Your AI-generated construction cost analysis and risk assessment.' }
};

function App() {
  const { view, error, setError, currentStep, analysisResults } = useProject();
  const mainContentRef = useRef(null);

  // Focus management when view changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [view, currentStep]);

  const seo = seoConfig[view] || seoConfig.hero;

  return (
    <div className="app">
      <SEO title={seo.title} description={seo.description} />
      <Header />
      
      <main 
        ref={mainContentRef} 
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
      >
        {view === 'hero' && (
          <section aria-labelledby="hero-title">
            <Hero />
          </section>
        )}
        
        {view === 'form' && (
          <section aria-labelledby="form-title">
            {error && (
              <div className="error-state" role="alert">
                <div className="error-icon">❌</div>
                <h3>Analysis Failed</h3>
                <p>{error}</p>
                <button 
                  className="btn-primary btn-hover" 
                  onClick={() => setError(null)}
                >
                  Try Again
                </button>
              </div>
            )}
            {!error && <FormContainer />}
          </section>
        )}
        
        {view === 'results' && analysisResults && (
          <section aria-labelledby="results-title">
            <Results />
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
