import React from 'react';
import { styles } from '../styles';

const Hero = ({ onStart }) => (
  <section style={styles.hero} className="fade-in">
    <div style={styles.container}>
      <h1 
        id="hero-title"
        style={{...styles.heroTitle, animationDelay: '0.1s'}} 
        className="slide-up"
      >
        Plan Smarter.<br />Build Better.
      </h1>
      <p style={{...styles.heroSubtitle, animationDelay: '0.2s'}} className="slide-up">
        AI-powered construction intelligence that helps you estimate materials, predict costs, and detect risks before breaking ground.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }} className="slide-up">
        <button 
          style={styles.ctaButton}
          onClick={onStart}
          className="btn-hover"
          aria-label="Get free construction cost estimate"
        >
          Get Free Estimate →
        </button>
      </div>

      {/* Trust signals */}
      <div style={{ 
        marginTop: '3rem', 
        display: 'flex', 
        gap: '2rem', 
        justifyContent: 'center',
        color: '#8B95A5',
        fontSize: '0.9rem',
        flexWrap: 'wrap',
        animationDelay: '0.4s'
      }} className="slide-up">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span aria-hidden="true">✓</span> No signup required
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span aria-hidden="true">✓</span> Instant results
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span aria-hidden="true">✓</span> 100% free
        </div>
      </div>
    </div>
  </section>
);

export default Hero;

