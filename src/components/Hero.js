import React from 'react';
import { useProject } from '../context/ProjectContext';
import Icon from './ui/Icon';
import { SiteLogoEmblem } from './ui/SiteLogo';

const Hero = () => {
  const { startProject } = useProject();

  return (
    <section className="hero fade-in">
      <div className="container">
        {/* Signature Brand Badge */}
        <div
          className="slide-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            background: 'rgba(255, 107, 0, 0.08)',
            border: '1px solid rgba(255, 107, 0, 0.3)',
            borderRadius: '999px',
            padding: '0.35rem 1.1rem 0.35rem 0.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(255, 107, 0, 0.15)'
          }}
        >
          <SiteLogoEmblem size={26} glow={true} />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'var(--primary)',
              fontFamily: "'IBM Plex Mono', monospace"
            }}
          >
            SITEPILOT • CONTECH INTELLIGENCE 2026
          </span>
        </div>

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
