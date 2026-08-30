import React from 'react';
import { useProject } from '../context/ProjectContext';
import PRICING_CONFIG from '../pricing.config.json';

const Header = () => {
  const { currency, setCurrency, unit, setUnit } = useProject();

  return (
    <header className="header fade-in">
      <div className="container">
        <div className="header-content">
          <div className="logo btn-hover">
            <div className="logo-icon">S</div>
            <div className="logo-text">
              Site<span className="logo-accent">Pilot</span>
            </div>
          </div>

          <div className="header-controls">
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
    </header>
  );
};

export default Header;
