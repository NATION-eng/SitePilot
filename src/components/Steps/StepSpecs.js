import React from 'react';
import { useProject } from '../../context/ProjectContext';
import Icon from '../ui/Icon';
import PRICING_CONFIG from '../../pricing.config.json';

const StepSpecs = () => {
  const { projectData, updateProjectData, toggleAddon, nextStep, prevStep, formatMoney } = useProject();

  const currentTier = projectData.specTier || 'standard';
  const selectedAddons = projectData.selectedAddons || [];

  return (
    <section className="fade-in" aria-labelledby="step-specs-title">
      <h2 id="step-specs-title" className="section-title">Engineering & Material Specs</h2>
      <p className="section-subtitle">Select finish quality grade, trade materials, and site infrastructure add-ons</p>

      {/* 1. Specification Tier Selector */}
      <div className="specs-section">
        <label className="label" style={{ marginBottom: '0.75rem' }}>
          Finish Quality Tier & Architectural Grade
        </label>
        <div className="responsive-grid-3" role="radiogroup" aria-label="Specification tier selection">
          {Object.entries(PRICING_CONFIG.specTiers).map(([tierKey, tierInfo]) => (
            <div
              key={tierKey}
              role="radio"
              aria-checked={currentTier === tierKey}
              tabIndex={0}
              className={`project-type-card card-hover spec-tier-card ${currentTier === tierKey ? 'selected' : ''}`}
              onClick={() => updateProjectData('specTier', tierKey)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  updateProjectData('specTier', tierKey);
                }
              }}
            >
              <div className="spec-tier-header">
                <Icon
                  name={tierKey === 'luxury' ? 'finishes' : tierKey === 'premium' ? 'tiles' : 'cement'}
                  size={26}
                  color={currentTier === tierKey ? 'var(--primary)' : 'var(--text-secondary)'}
                />
                <div className="spec-tier-multiplier">{tierInfo.multiplier}x Rate</div>
              </div>
              <div className="project-type-name" style={{ fontSize: '1rem', marginTop: '0.4rem' }}>{tierInfo.name}</div>
              <p className="spec-tier-desc">{tierInfo.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Specific Material Trade Overrides */}
      <div className="specs-section" style={{ marginTop: '2rem' }}>
        <h3 className="specs-subheading">
          <Icon name="drafting" size={18} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Specific Trade Materials
        </h3>

        <div className="responsive-grid-2">
          {/* Flooring */}
          <div className="form-group">
            <label htmlFor="flooring-select" className="label">
              <Icon name="tiles" size={15} color="var(--primary)" style={{ marginRight: '0.3rem' }} /> Flooring Material
            </label>
            <select
              id="flooring-select"
              value={projectData.flooringType || 'ceramic'}
              onChange={(e) => updateProjectData('flooringType', e.target.value)}
              className="input-base"
            >
              {Object.entries(PRICING_CONFIG.materialOptions.flooring).map(([k, opt]) => (
                <option key={k} value={k}>
                  {opt.name} — ~{formatMoney(opt.rate)}/sqm
                </option>
              ))}
            </select>
          </div>

          {/* Roofing */}
          <div className="form-group">
            <label htmlFor="roofing-select" className="label">
              <Icon name="roofing" size={15} color="var(--primary)" style={{ marginRight: '0.3rem' }} /> Roofing System
            </label>
            <select
              id="roofing-select"
              value={projectData.roofingType || 'aluminium'}
              onChange={(e) => updateProjectData('roofingType', e.target.value)}
              className="input-base"
            >
              {Object.entries(PRICING_CONFIG.materialOptions.roofing).map(([k, opt]) => (
                <option key={k} value={k}>
                  {opt.name} — ~{formatMoney(opt.rate)}/sqm
                </option>
              ))}
            </select>
          </div>

          {/* Ceiling */}
          <div className="form-group">
            <label htmlFor="ceiling-select" className="label">
              <Icon name="pop" size={15} color="var(--primary)" style={{ marginRight: '0.3rem' }} /> Ceiling Specification
            </label>
            <select
              id="ceiling-select"
              value={projectData.ceilingType || 'pop'}
              onChange={(e) => updateProjectData('ceilingType', e.target.value)}
              className="input-base"
            >
              {Object.entries(PRICING_CONFIG.materialOptions.ceiling).map(([k, opt]) => (
                <option key={k} value={k}>
                  {opt.name} — ~{formatMoney(opt.rate)}/sqm
                </option>
              ))}
            </select>
          </div>

          {/* Foundation */}
          <div className="form-group">
            <label htmlFor="foundation-select" className="label">
              <Icon name="structure" size={15} color="var(--primary)" style={{ marginRight: '0.3rem' }} /> Substructure & Soil Condition
            </label>
            <select
              id="foundation-select"
              value={projectData.foundationType || 'strip'}
              onChange={(e) => updateProjectData('foundationType', e.target.value)}
              className="input-base"
            >
              {Object.entries(PRICING_CONFIG.materialOptions.foundation).map(([k, opt]) => (
                <option key={k} value={k}>
                  {opt.name} ({opt.multiplier}x sub)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 3. Engineering Add-ons & Ancillary Works */}
      <div className="specs-section" style={{ marginTop: '2rem' }}>
        <h3 className="specs-subheading">
          <Icon name="mep" size={18} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Engineering Add-ons & Site Infrastructure (Optional)
        </h3>

        <div className="addons-grid">
          {Object.entries(PRICING_CONFIG.engineeringAddons).map(([addonKey, addon]) => {
            const isChecked = selectedAddons.includes(addonKey);
            return (
              <div
                key={addonKey}
                className={`addon-card card-hover ${isChecked ? 'addon-card-selected' : ''}`}
                onClick={() => toggleAddon(addonKey)}
                role="checkbox"
                aria-checked={isChecked}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleAddon(addonKey);
                  }
                }}
              >
                <div className="addon-checkbox">
                  {isChecked ? <Icon name="check" size={14} color="#fff" /> : null}
                </div>
                <div className="addon-content">
                  <div className="addon-name">{addon.name}</div>
                  <div className="addon-meta">
                    <span className="addon-category">{addon.category}</span>
                    <span className="addon-price">+{formatMoney(addon.cost)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="button-group" style={{ marginTop: '2.5rem' }}>
        <button
          type="button"
          className="btn-secondary btn-hover"
          onClick={prevStep}
          aria-label="Back to dimensions"
        >
          ← Back
        </button>
        <button
          type="button"
          className="btn-primary btn-hover"
          onClick={nextStep}
          aria-label="Continue to budget and timeline"
        >
          Continue →
        </button>
      </div>
    </section>
  );
};

export default StepSpecs;
