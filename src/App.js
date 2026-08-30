import React, { useRef, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import FormContainer from './components/FormContainer';
import Results from './components/Results/Results';
import SEO from './components/SEO';
import { useProject } from './context/ProjectContext';

const seoConfig = {
  hero: {
    title: 'Home',
    description: 'Smart construction cost estimator — calculate materials, predict costs, and detect risks before breaking ground.'
  },
  form: {
    title: 'New Estimate',
    description: 'Enter your construction project specifications for an instant cost and material estimate.'
  },
  results: {
    title: 'Estimate Results',
    description: 'Your comprehensive construction material takeoff, cost breakdown, and risk assessment.'
  }
};

function App() {
  const { view, error, setError, currentStep, analysisResults, announcement } = useProject();
  const mainContentRef = useRef(null);

  // Focus management when view changes (without jarring outline or scroll)
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus({ preventScroll: true });
    }
  }, [view, currentStep]);

  const seo = seoConfig[view] || seoConfig.hero;

  return (
    <div className="app">
      <SEO title={seo.title} description={seo.description} />
      
      {/* Targeted screen reader announcement channel */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      <Header />
      
      <main 
        ref={mainContentRef} 
        tabIndex={-1}
        className="main-content"
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
                <h3>Calculation Failed</h3>
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
