import React from 'react';
import { styles } from '../styles';

const Hero = ({ onStart }) => (
  <section style={styles.hero} className="fade-in">
    <div style={styles.container}>
      <h1 style={{...styles.heroTitle, animationDelay: '0.1s'}} className="slide-up">
        Plan Smarter.<br />Build Better.
      </h1>
      <p style={{...styles.heroSubtitle, animationDelay: '0.2s'}} className="slide-up">
        AI-powered construction intelligence that helps you estimate materials, predict costs, and detect risks before breaking ground.
      </p>
      <button 
        style={{...styles.ctaButton, animationDelay: '0.3s'}}
        onClick={onStart}
        className="btn-hover slide-up"
      >
        Start New Project
      </button>
    </div>
  </section>
);

export default Hero;
