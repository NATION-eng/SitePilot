import React from 'react';
import { styles } from '../../styles';

const StepThree = ({ projectData, updateProjectData, prevStep, generateAnalysis }) => (
  <div className="fade-in">
    <h2 style={styles.sectionTitle}>Budget & Timeline</h2>
    <p style={styles.sectionSubtitle}>Set your financial and time constraints</p>

    <div style={styles.formGroup}>
      <label style={styles.label}>Budget Range (₦)</label>
      <input
        type="number"
        className="input-field"
        style={styles.input}
        placeholder="e.g., 15000000"
        value={projectData.budget}
        onChange={(e) => updateProjectData('budget', e.target.value)}
      />
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Expected Timeline (months)</label>
      <input
        type="number"
        className="input-field"
        style={styles.input}
        placeholder="e.g., 12"
        value={projectData.timeline}
        onChange={(e) => updateProjectData('timeline', e.target.value)}
      />
    </div>

    <div style={styles.formGroup}>
      <label style={styles.label}>Additional Notes (Optional)</label>
      <textarea
        className="input-field"
        style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
        placeholder="Any specific requirements or concerns..."
        value={projectData.notes}
        onChange={(e) => updateProjectData('notes', e.target.value)}
      />
    </div>

    <div style={styles.buttonGroup}>
      <button style={styles.btnSecondary} onClick={prevStep} className="btn-hover">Back</button>
      <button style={styles.btnPrimary} onClick={generateAnalysis} className="btn-hover">Generate Analysis</button>
    </div>
  </div>
);

export default StepThree;
