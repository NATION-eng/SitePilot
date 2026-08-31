import React from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useProject } from '../../context/ProjectContext';
import Input from '../ui/Input';
import Icon from '../ui/Icon';
import PRICING_CONFIG from '../../pricing.config.json';

const StepTwo = () => {
  const { projectData, updateProjectData, nextStep, prevStep, unitInfo } = useProject();
  const { errors, validate, validateMultiple } = useFormValidation();

  const handleNext = () => {
    const isValid = validateMultiple([
      { field: 'location', value: projectData.location },
      { field: 'buildingSize', value: projectData.buildingSize },
      { field: 'floors', value: projectData.floors }
    ]);
    
    if (isValid) {
      nextStep();
    }
  };

  const selectedRegion = PRICING_CONFIG.regionalIndices[projectData.regionKey || 'lagos_island'] || PRICING_CONFIG.regionalIndices.other_states;

  return (
    <section className="fade-in" aria-labelledby="step-two-title">
      <h2 id="step-two-title" className="section-title">Location & Dimensions</h2>
      <p className="section-subtitle">Select regional location cost index and physical building dimensions</p>

      {/* Nigerian Geopolitical & State Cost Index Selector */}
      <div className="form-group" style={{ marginBottom: '1.25rem' }}>
        <label htmlFor="region-select" className="label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            <Icon name="structure" size={15} color="var(--primary)" style={{ marginRight: '0.35rem' }} />
            State & Regional Cost Index
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>
            {selectedRegion.multiplier}x Logistics & Market Factor
          </span>
        </label>
        <select
          id="region-select"
          className="input-base"
          value={projectData.regionKey || 'lagos_island'}
          onChange={(e) => {
            const rKey = e.target.value;
            updateProjectData('regionKey', rKey);
            // Pre-fill location if empty
            if (!projectData.location) {
              const rInfo = PRICING_CONFIG.regionalIndices[rKey];
              if (rInfo) updateProjectData('location', rInfo.name.split(' (')[0]);
            }
          }}
        >
          {Object.entries(PRICING_CONFIG.regionalIndices).map(([key, reg]) => (
            <option key={key} value={key}>
              {reg.name} — {reg.multiplier}x ({reg.zone})
            </option>
          ))}
        </select>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
          ℹ️ {selectedRegion.description}
        </div>
      </div>

      <Input
        label="Specific Site Address / Area"
        name="location"
        value={projectData.location}
        onChange={(value) => {
          updateProjectData('location', value);
          validate('location', value);
        }}
        error={errors.location}
        placeholder="e.g., Admiralty Way, Lekki Phase 1, Lagos"
        required
        maxLength={100}
        autoComplete="address-level2"
      />

      <div className="responsive-form-row">
        <Input
          label={`Building Area (${unitInfo?.symbol || 'm²'})`}
          name="buildingSize"
          type="number"
          min={1}
          max={100000}
          value={projectData.buildingSize}
          onChange={(value) => {
            updateProjectData('buildingSize', value);
            validate('buildingSize', value);
          }}
          error={errors.buildingSize}
          placeholder="e.g., 250"
          required
        />
        
        <Input
          label="Number of Floors"
          name="floors"
          type="number"
          min={1}
          max={100}
          value={projectData.floors}
          onChange={(value) => {
            updateProjectData('floors', value);
            validate('floors', value);
          }}
          error={errors.floors}
          placeholder="e.g., 2"
          required
        />
      </div>

      <div className="button-group">
        <button 
          className="btn-secondary btn-hover"
          onClick={prevStep}
          aria-label="Go back to previous step"
        >
          ← Back
        </button>
        <button 
          className="btn-primary btn-hover"
          onClick={handleNext}
          aria-label="Continue to next step"
        >
          Continue →
        </button>
      </div>
    </section>
  );
};

export default StepTwo;
