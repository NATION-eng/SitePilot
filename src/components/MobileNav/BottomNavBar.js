import React, { useState, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import MaterialRatesDropdown from '../PriceManager/MaterialRatesDropdown';
import ProjectHistoryDrawer from '../Portfolio/ProjectHistoryDrawer';
import MobileSettingsSheet from './MobileSettingsSheet';
import styles from './BottomNavBar.module.css';

const BottomNavBar = () => {
  const { view, setView, savedProjects, resetProject } = useProject();
  const [activeSheet, setActiveSheet] = useState(null); // 'rates' | 'portfolio' | 'settings' | null
  const ratesBtnRef = useRef(null);

  const close = () => setActiveSheet(null);

  const handleHome = () => {
    resetProject();
    close();
  };

  const handleEstimate = () => {
    if (view !== 'form') setView('form');
    close();
  };

  return (
    <>
      <nav className={styles.navbar} role="navigation" aria-label="Mobile navigation">

        {/* Home */}
        <button
          type="button"
          className={`${styles.tab} ${view === 'hero' ? styles.active : ''}`}
          onClick={handleHome}
          aria-label="Home"
        >
          <span className={styles.icon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor"/>
            </svg>
          </span>
          <span className={styles.label}>Home</span>
        </button>

        {/* New Estimate */}
        <button
          type="button"
          className={`${styles.tab} ${view === 'form' ? styles.active : ''}`}
          onClick={handleEstimate}
          aria-label="New Estimate"
        >
          <span className={styles.icon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor"/>
              <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor"/>
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor"/>
            </svg>
          </span>
          <span className={styles.label}>Estimate</span>
        </button>

        {/* Material Rates */}
        <button
          ref={ratesBtnRef}
          type="button"
          className={`${styles.tab} ${activeSheet === 'rates' ? styles.active : ''}`}
          onClick={() => setActiveSheet(prev => prev === 'rates' ? null : 'rates')}
          aria-label="Material Rates"
          aria-expanded={activeSheet === 'rates'}
        >
          <span className={styles.icon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor"/>
            </svg>
          </span>
          <span className={styles.label}>Rates</span>
        </button>

        {/* Projects */}
        <button
          type="button"
          className={`${styles.tab} ${activeSheet === 'portfolio' ? styles.active : ''}`}
          onClick={() => setActiveSheet(prev => prev === 'portfolio' ? null : 'portfolio')}
          aria-label={`Projects, ${savedProjects.length} saved`}
        >
          <span className={styles.icon} style={{ position: 'relative' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke="currentColor"/>
            </svg>
            {savedProjects.length > 0 && (
              <span className={styles.badge}>{savedProjects.length > 9 ? '9+' : savedProjects.length}</span>
            )}
          </span>
          <span className={styles.label}>Projects</span>
        </button>

        {/* Settings / More */}
        <button
          type="button"
          className={`${styles.tab} ${activeSheet === 'settings' ? styles.active : ''}`}
          onClick={() => setActiveSheet(prev => prev === 'settings' ? null : 'settings')}
          aria-label="Settings"
        >
          <span className={styles.icon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" stroke="currentColor"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor"/>
            </svg>
          </span>
          <span className={styles.label}>More</span>
        </button>
      </nav>

      {/* Material Rates — mobile bottom sheet */}
      <MaterialRatesDropdown
        isOpen={activeSheet === 'rates'}
        anchorRef={ratesBtnRef}
        onClose={close}
      />

      {/* Portfolio Drawer */}
      <ProjectHistoryDrawer
        isOpen={activeSheet === 'portfolio'}
        onClose={close}
      />

      {/* Settings Sheet */}
      <MobileSettingsSheet
        isOpen={activeSheet === 'settings'}
        onClose={close}
      />
    </>
  );
};

export default BottomNavBar;
