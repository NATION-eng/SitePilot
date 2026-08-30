import React from 'react';
import { useFormValidation } from '../../hooks/useFormValidation';
import { useProject } from '../../context/ProjectContext';
import Input from '../ui/Input';

const StepThree = () => {
  const { projectData, updateProjectData, prevStep, generateAnalysis } = useProject();
  const { errors, validate, validateMultiple } = useFormValidation();

  const handleGenerate = () => {
    const isValid = validateMultiple([
      { field: 'budget', value: projectData.budget },
      { field: 'timeline', value: projectData.timeline }
    ]);
    
    if (isValid) {
      generateAnalysis();
    }
  };

  return (
    <section className="fade-in" aria-labelledby="step-three-title">
      <h2 id="step-three-title" className="section-title">Budget & Timeline</h2>
      <p className="section-subtitle">Set your financial and time constraints</p>

      <Input
        label="Budget Range (₦)"
        name="budget"
        type="number"
        min={1}
        max={10000000000}
        value={projectData.budget}
        onChange={(value) => {
          updateProjectData('budget', value);
          validate('budget', value);
        }}
        error={errors.budget}
        placeholder="e.g., 15000000"
        required
      />

      <Input
        label="Expected Timeline (months)"
        name="timeline"
        type="number"
        min={1}
        max={120}
        value={projectData.timeline}
        onChange={(value) => {
          updateProjectData('timeline', value);
          validate('timeline', value);
        }}
        error={errors.timeline}
        placeholder="e.g., 12"
        required
      />

      <div className="form-group">
        <label htmlFor="notes" className="label">Additional Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          className="textarea input-field"
          placeholder="Any specific requirements or concerns..."
          maxLength={500}
          value={projectData.notes}
          onChange={(e) => updateProjectData('notes', e.target.value)}
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
          onClick={handleGenerate}
          aria-label="Generate cost analysis"
        >
          Generate Analysis
        </button>
      </div>
    </section>
  );
};

export default StepThree;
