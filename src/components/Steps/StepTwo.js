import React from 'react';
import { styles } from '../../styles';

const StepTwo = ({ projectData, updateProjectData, nextStep, prevStep }) => (
  <div className="fade-in">
    <h2 style={styles.sectionTitle}>Project Details</h2>
    <p style={styles.sectionSubtitle}>Tell us about your project specifications</p>

    <div style={styles.formGroup}>
      <label style={styles.label}>Location</label>
      <input
        type="text"
        className="input-field"
        style={styles.input}
        placeholder="e.g., Lagos, Nigeria"
        value={projectData.location}
        onChange={(e) => updateProjectData('location', e.target.value)}
      />
    </div>

    <div style={styles.formRow}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Building Size (sqm)</label>
        <input
          type="number"
          className="input-field"
          style={styles.input}
          placeholder="e.g., 250"
          value={projectData.buildingSize}
          onChange={(e) => updateProjectData('buildingSize', e.target.value)}
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Number of Floors</label>
        <input
          type="number"
          className="input-field"
          style={styles.input}
          placeholder="e.g., 2"
          value={projectData.floors}
          onChange={(e) => updateProjectData('floors', e.target.value)}
        />
      </div>
    </div>

    <div style={styles.buttonGroup}>
      <button style={styles.btnSecondary} onClick={prevStep} className="btn-hover">Back</button>
      <button style={styles.btnPrimary} onClick={nextStep} className="btn-hover">Continue</button>
    </div>
  </div>
);

export default StepTwo;
