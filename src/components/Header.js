import React, { useState, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import MaterialRatesDropdown from './PriceManager/MaterialRatesDropdown';
import ProjectHistoryDrawer from './Portfolio/ProjectHistoryDrawer';
import InstallPWAButton from './PWA/InstallPWAButton';
import SiteLogo from './ui/SiteLogo';

const Header = () => {
  const { savedProjects, resetProject } = useProject();
  const [isRatesDropdownOpen, setIsRatesDropdownOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const ratesBtnRef = useRef(null);

  return (
    <>
      <header className="header fade-in">
        <div className="container">
          <div className="header-content">
            {/* Logo — always visible */}
            <div
              className="logo btn-hover"
              onClick={resetProject}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && resetProject()}
              style={{ cursor: 'pointer' }}
              aria-label="Go to SitePilot home"
            >
              <SiteLogo size={38} showTagline={true} />
            </div>

            {/* Desktop-only controls (hidden on mobile — bottom nav handles them) */}
            <div className="header-controls desktop-only-controls">
              <InstallPWAButton />

              {/* Projects */}
              <button
                type="button"
                className="rates-btn btn-hover"
                onClick={() => setIsPortfolioOpen(true)}
                title="Saved project estimates"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem' }}>
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                </svg>
                <span>Projects ({savedProjects.length})</span>
              </button>

              {/* Material Rates */}
              <div className="rates-dropdown-wrapper" style={{ position: 'relative' }}>
                <button
                  ref={ratesBtnRef}
                  type="button"
                  className={`rates-btn btn-hover ${isRatesDropdownOpen ? 'rates-btn-active' : ''}`}
                  onClick={() => setIsRatesDropdownOpen(prev => !prev)}
                  aria-expanded={isRatesDropdownOpen}
                  aria-haspopup="dialog"
                  title="Material unit prices"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.35rem' }}>
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  <span>Rates</span>
                  <span style={{ fontSize: '0.7rem', marginLeft: '0.35rem', opacity: 0.7 }}>
                    {isRatesDropdownOpen ? '▲' : '▼'}
                  </span>
                </button>
                <MaterialRatesDropdown
                  isOpen={isRatesDropdownOpen}
                  anchorRef={ratesBtnRef}
                  onClose={() => setIsRatesDropdownOpen(false)}
                />
              </div>

              <DesktopCurrencyUnit />

              <div className="header-badge">SMART ESTIMATOR</div>
            </div>

            {/* Mobile-only: just install button on the right */}
            <div className="mobile-only-controls">
              <InstallPWAButton />
            </div>
          </div>
        </div>
      </header>

      {/* Portfolio drawer (triggered by bottom nav on mobile OR header button on desktop) */}
      <ProjectHistoryDrawer
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />

      {/* Desktop Material Rates Dropdown (only fires on desktop, handled by bottom nav on mobile) */}
    </>
  );
};

/* Currency + Unit selectors — desktop only */
const DesktopCurrencyUnit = () => {
  const { currency, setCurrency, unit, setUnit } = useProject();
  // Import inline to avoid circular dep
  const [cfg, setCfg] = React.useState(null);
  React.useEffect(() => {
    import('../pricing.config.json').then(m => setCfg(m.default || m));
  }, []);

  return (
    <>
      <div className="control-group">
        <label htmlFor="currency-select-desktop" className="control-label">Currency:</label>
        <select
          id="currency-select-desktop"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="header-select"
          aria-label="Select display currency"
        >
          {cfg && Object.entries(cfg.currencies).map(([code, info]) => (
            <option key={code} value={code}>{info.symbol} {code}</option>
          ))}
        </select>
      </div>
      <div className="control-group">
        <label htmlFor="unit-select-desktop" className="control-label">Unit:</label>
        <select
          id="unit-select-desktop"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="header-select"
          aria-label="Select area measurement unit"
        >
          <option value="sqm">m² Metric</option>
          <option value="sqft">sq ft Imperial</option>
        </select>
      </div>
    </>
  );
};

export default Header;
