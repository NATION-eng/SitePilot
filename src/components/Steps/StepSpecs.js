import React from 'react';
import { useProject } from '../../context/ProjectContext';
import Icon from '../ui/Icon';
import PRICING_CONFIG from '../../pricing.config.json';

const UNIT_OPTIONS = [
  { value: 'sqm', label: 'sqm (m²)' },
  { value: 'pcs', label: 'pieces' },
  { value: 'tons', label: 'tons' },
  { value: 'bags', label: 'bags' },
  { value: 'drums', label: 'drums (20L)' },
  { value: 'meters', label: 'linear meters' },
  { value: 'sets', label: 'sets' },
  { value: 'units', label: 'units' },
  { value: 'lots', label: 'lots' }
];

const StepSpecs = () => {
  const {
    projectData,
    updateProjectData,
    toggleAddon,
    addCustomMaterial,
    updateCustomMaterial,
    removeCustomMaterial,
    nextStep,
    prevStep,
    formatMoney,
    materialPrices
  } = useProject();

  const currentTier = projectData.specTier || 'standard';
  const selectedAddons = projectData.selectedAddons || [];
  const customMaterials = projectData.customMaterials || [];
  const mat = materialPrices || PRICING_CONFIG.materials;

  const flooringScale = (mat.tiles_sqm || PRICING_CONFIG.materials.tiles_sqm) / PRICING_CONFIG.materials.tiles_sqm;
  const roofingScale = (mat.roofing_sqm || PRICING_CONFIG.materials.roofing_sqm) / PRICING_CONFIG.materials.roofing_sqm;
  const ceilingScale = (mat.pop_sqm || PRICING_CONFIG.materials.pop_sqm) / PRICING_CONFIG.materials.pop_sqm;

  return (
    <section className="fade-in" aria-labelledby="step-specs-title">
      <h2 id="step-specs-title" className="section-title">Engineering & Material Specs</h2>
      <p className="section-subtitle">Select finish quality grade, trade materials, site infrastructure, and add custom project materials</p>

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
                  {opt.name} — ~{formatMoney(Math.round(opt.rate * flooringScale))}/sqm
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
                  {opt.name} — ~{formatMoney(Math.round(opt.rate * roofingScale))}/sqm
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
                  {opt.name} — ~{formatMoney(Math.round(opt.rate * ceilingScale))}/sqm
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

      {/* 3. Custom Materials & Takeoff Items Column */}
      <div className="specs-section" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <h3 className="specs-subheading" style={{ margin: 0 }}>
              <Icon name="tools" size={18} color="var(--primary)" style={{ marginRight: '0.4rem' }} /> Custom Materials & Takeoff Items
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Add specialized engineering materials, finishes, or custom takeoff items
            </p>
          </div>
          <button
            type="button"
            className="btn-outline btn-hover"
            onClick={() => addCustomMaterial({ name: '', unit: 'sqm', quantity: '', unitPrice: '' })}
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
          >
            + Add Material Item
          </button>
        </div>

        {customMaterials.length === 0 ? (
          <div className="custom-mat-empty-box">
            <Icon name="tools" size={24} color="var(--text-secondary)" />
            <p style={{ margin: '0.5rem 0 0.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              No custom materials added yet.
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted, #64748B)' }}>
              Click below to specify custom granite slabs, acoustic panels, custom steelwork, or any additional takeoff materials.
            </p>
            <button
              type="button"
              className="btn-secondary btn-hover"
              onClick={() => addCustomMaterial({ name: '', unit: 'sqm', quantity: '', unitPrice: '' })}
              style={{ marginTop: '0.75rem', fontSize: '0.8rem' }}
            >
              + Add Custom Material
            </button>
          </div>
        ) : (
          <div className="custom-mat-table-wrapper">
            <table className="custom-mat-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Material Description</th>
                  <th style={{ width: '18%' }}>Unit</th>
                  <th style={{ width: '14%' }}>Quantity</th>
                  <th style={{ width: '18%' }}>Unit Price (₦)</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {customMaterials.map((item, idx) => {
                  const qty = parseFloat(item.quantity) || 0;
                  const price = parseFloat(item.unitPrice) || 0;
                  const lineTotal = qty * price;

                  return (
                    <tr key={item.id || idx}>
                      <td>
                        <input
                          type="text"
                          className="input-base custom-mat-input"
                          placeholder="e.g., Italian Marble Slabs"
                          value={item.name}
                          onChange={(e) => updateCustomMaterial(item.id, 'name', e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          className="input-base custom-mat-input"
                          value={item.unit || 'sqm'}
                          onChange={(e) => updateCustomMaterial(item.id, 'unit', e.target.value)}
                        >
                          {UNIT_OPTIONS.map((u) => (
                            <option key={u.value} value={u.value}>{u.label}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          className="input-base custom-mat-input"
                          placeholder="0"
                          value={item.quantity}
                          onChange={(e) => updateCustomMaterial(item.id, 'quantity', e.target.value)}
                        />
                      </td>
                      <td>
                        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                          <span style={{ position: 'absolute', left: '8px', color: 'var(--primary)', fontWeight: 'bold', fontSize: '0.8rem' }}>₦</span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            className="input-base custom-mat-input"
                            style={{ paddingLeft: '1.4rem' }}
                            placeholder="0"
                            value={item.unitPrice}
                            onChange={(e) => updateCustomMaterial(item.id, 'unitPrice', e.target.value)}
                          />
                        </div>
                        {lineTotal > 0 && (
                          <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '2px', fontWeight: 600 }}>
                            Total: {formatMoney(lineTotal)}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          className="custom-mat-del-btn"
                          onClick={() => removeCustomMaterial(item.id)}
                          title="Remove material"
                          aria-label={`Remove ${item.name || 'material'}`}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Engineering Add-ons & Ancillary Works */}
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
