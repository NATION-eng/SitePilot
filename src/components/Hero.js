import React from 'react';
import { useProject } from '../context/ProjectContext';
import Icon from './ui/Icon';

const Hero = () => {
  const { startProject } = useProject();

  return (
    <section className="hero fade-in">
      <div className="container">
        <h1 id="hero-title" className="hero-title slide-up" style={{ animationDelay: '0.1s' }}>
          Plan Smarter.<br />Build Better.
        </h1>
        <p className="hero-subtitle slide-up" style={{ animationDelay: '0.2s' }}>
          Smart construction cost estimator that helps you calculate materials, predict costs, and detect risks before breaking ground — using Nigerian QS heuristics and 2026 market prices.
        </p>

        <div className="hero-actions slide-up" style={{ animationDelay: '0.3s' }}>
          <button
            className="cta-button btn-hover"
            onClick={startProject}
            aria-label="Get free construction cost estimate"
          >
            Get Free Estimate →
          </button>
        </div>

        {/* Trust signals with custom SVG icons */}
        <div className="trust-signals slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="trust-item">
            <Icon name="check" size={16} color="var(--success)" /> No signup required
          </div>
          <div className="trust-item">
            <Icon name="check" size={16} color="var(--success)" /> Instant results
          </div>
          <div className="trust-item">
            <Icon name="check" size={16} color="var(--success)" /> 100% free
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
