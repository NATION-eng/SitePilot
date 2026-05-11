import React from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useProject } from '../../context/ProjectContext';
import Input from '../ui/Input';

const StepTwo = () => {
  const { projectData, updateProjectData, nextStep, prevStep } = useProject();
  const { errors, validate } = useFormValidation();

  const handleNext = () => {
    const isLocationValid = validate('location', projectData.location);
    const isSizeValid = validate('buildingSize', projectData.buildingSize);
    const isFloorsValid = validate('floors', projectData.floors);
    
    if (isLocationValid && isSizeValid && isFloorsValid) {
      nextStep();
    }
  };

  return (
    <section className="fade-in" aria-labelledby="step-two-title">
      <h2 id="step-two-title" className="section-title">Project Details</h2>
      <p className="section-subtitle">Tell us about your project specifications</p>

      <Input
        label="Location"
        name="location"
        value={projectData.location}
        onChange={(value) => {
          updateProjectData('location', value);
          validate('location', value);
        }}
        error={errors.location}
        placeholder="e.g., Lagos, Nigeria"
        required
        autoComplete="address-level2"
      />

      <div className="responsive-form-row">
        <Input
          label="Building Size (sqm)"
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
          Back
        </button>
        <button 
          className="btn-primary btn-hover"
          onClick={handleNext}
          aria-label="Continue to next step"
        >
          Continue
        </button>
      </div>
    </section>
  );
};

export default StepTwo;
