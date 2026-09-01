import React, { useState, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import MaterialRatesDropdown from './PriceManager/MaterialRatesDropdown';
import ProjectHistoryDrawer from './Portfolio/ProjectHistoryDrawer';
import InstallPWAButton from './PWA/InstallPWAButton';
import Icon from './ui/Icon';
import PRICING_CONFIG from '../pricing.config.json';

const Header = () => {
  const { currency, setCurrency, unit, setUnit, savedProjects, resetProject } = useProject();
  const [isRatesDropdownOpen, setIsRatesDropdownOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);
  const ratesBtnRef = useRef(null);

  return (
    <header className="header fade-in">
      <div className="container">
        <div className="header-content">
          <div className="logo btn-hover" onClick={resetProject} role="button" tabIndex={0} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">S</div>
            <div className="logo-text">
              Site<span className="logo-accent">Pilot</span>
            </div>
          </div>

          <div className="header-controls">
            {/* Install PWA Button */}
            <InstallPWAButton />

            {/* Project Portfolio Drawer Button */}
            <button
              type="button"
              className="rates-btn btn-hover"
              onClick={() => setIsPortfolioOpen(true)}
              title="View and manage saved construction project estimates"
            >
              <Icon name="box" size={14} color="var(--primary)" style={{ marginRight: '0.35rem' }} />
              <span>Projects ({savedProjects.length})</span>
            </button>

            {/* Material Rates Dropdown Trigger */}
            <div className="rates-dropdown-wrapper" style={{ position: 'relative' }}>
              <button
                ref={ratesBtnRef}
                type="button"
                className={`rates-btn btn-hover ${isRatesDropdownOpen ? 'rates-btn-active' : ''}`}
                onClick={() => setIsRatesDropdownOpen(prev => !prev)}
                aria-expanded={isRatesDropdownOpen}
                aria-haspopup="dialog"
                title="Inspect and edit live material unit prices & market inflation rates"
              >
                <Icon name="drafting" size={14} color="var(--primary)" style={{ marginRight: '0.35rem' }} />
                <span>Material Rates</span>
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

            {/* Currency Selector */}
            <div className="control-group">
              <label htmlFor="currency-select" className="control-label">Currency:</label>
              <select
                id="currency-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="header-select"
                aria-label="Select display currency"
              >
                {Object.entries(PRICING_CONFIG.currencies).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.symbol} {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Switcher */}
            <div className="control-group">
              <label htmlFor="unit-select" className="control-label">Unit:</label>
              <select
                id="unit-select"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="header-select"
                aria-label="Select area measurement unit"
              >
                <option value="sqm">m² (Metric)</option>
                <option value="sqft">sq ft (Imperial)</option>
              </select>
            </div>

            <div className="header-badge">SMART ESTIMATOR</div>
          </div>
        </div>
      </div>

      <ProjectHistoryDrawer
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />
    </header>
  );
};

export default Header;
