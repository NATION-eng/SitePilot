import React from 'react';
import { styles } from '../styles';

const Header = () => (
  <header style={styles.header} className="fade-in">
    <div style={styles.container}>
      <div style={styles.headerContent}>
        <div style={styles.logo} className="btn-hover">
          <div style={styles.logoIcon}>S</div>
          <div style={styles.logoText}>
            Site<span style={{ color: '#FF6B00' }}>Pilot</span>
          </div>
        </div>
        <div style={styles.headerBadge}>AI CONSTRUCTION INTELLIGENCE</div>
      </div>
    </div>
  </header>
);

export default Header;
