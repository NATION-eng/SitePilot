import React from 'react';
import { styles } from '../../styles';
import { useFormValidation } from '../../hooks/useFormValidation';
import Input from '../ui/Input';

const StepThree = ({ projectData, updateProjectData, prevStep, generateAnalysis }) => {
  const { errors, validate } = useFormValidation();

  const handleGenerate = () => {
    const isBudgetValid = validate('budget', projectData.budget);
    const isTimelineValid = validate('timeline', projectData.timeline);
    
    if (isBudgetValid && isTimelineValid) {
      generateAnalysis();
    }
  };

  return (
    <section className="fade-in" aria-labelledby="step-three-title">
      <h2 id="step-three-title" style={styles.sectionTitle}>Budget & Timeline</h2>
      <p style={styles.sectionSubtitle}>Set your financial and time constraints</p>

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

      <div style={styles.formGroup}>
        <label htmlFor="notes" style={styles.label}>Additional Notes (Optional)</label>
        <textarea
          id="notes"
          name="notes"
          className="input-field"
          style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
          placeholder="Any specific requirements or concerns..."
          value={projectData.notes}
          onChange={(e) => updateProjectData('notes', e.target.value)}
          aria-label="Additional notes for your project"
        />
      </div>

      <div style={styles.buttonGroup}>
        <button 
          style={styles.btnSecondary} 
          onClick={prevStep} 
          className="btn-hover"
          aria-label="Go back to previous step"
        >
          Back
        </button>
        <button 
          style={styles.btnPrimary} 
          onClick={handleGenerate} 
          className="btn-hover"
          aria-label="Generate cost analysis"
        >
          Generate Analysis
        </button>
      </div>
    </section>
  );
};

export default StepThree;

