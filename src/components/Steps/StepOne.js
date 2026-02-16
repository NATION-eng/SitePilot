import React from 'react';
import { styles } from '../../styles';

const StepOne = ({ projectData, updateProjectData, nextStep, resetProject }) => {
  const projectTypes = [
    { id: 'residential', icon: '🏠', name: 'Residential' },
    { id: 'commercial', icon: '🏢', name: 'Commercial' },
    { id: 'industrial', icon: '🏭', name: 'Industrial' }
  ];

  const handleKeyPress = (e, typeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      updateProjectData('projectType', typeId);
    }
  };

  return (
    <section className="fade-in" aria-labelledby="step-one-title">
      <h2 id="step-one-title" style={styles.sectionTitle}>Project Type</h2>
      <p style={styles.sectionSubtitle}>Select the type of construction project</p>
      
      <div 
        className="responsive-grid-3" 
        role="radiogroup" 
        aria-label="Project type selection"
      >
        {projectTypes.map(type => (
          <div
            key={type.id}
            role="radio"
            aria-checked={projectData.projectType === type.id}
            tabIndex={0}
            onKeyPress={(e) => handleKeyPress(e, type.id)}
            className="card-hover"
            style={{
              ...styles.projectTypeCard,
              ...(projectData.projectType === type.id ? styles.projectTypeCardSelected : {})
            }}
            onClick={() => updateProjectData('projectType', type.id)}
          >
            <div style={styles.projectTypeIcon} aria-hidden="true">{type.icon}</div>
            <div style={styles.projectTypeName}>{type.name}</div>
          </div>
        ))}
      </div>

      <div style={styles.buttonGroup}>
        <button 
          style={styles.btnSecondary} 
          onClick={resetProject} 
          className="btn-hover"
          aria-label="Cancel and return to home"
        >
          Cancel
        </button>
        <button
          className="btn-hover"
          style={{
            ...styles.btnPrimary,
            opacity: projectData.projectType ? 1 : 0.5,
            cursor: projectData.projectType ? 'pointer' : 'not-allowed'
          }}
          onClick={nextStep}
          disabled={!projectData.projectType}
          aria-label="Continue to next step"
          aria-disabled={!projectData.projectType}
        >
          Continue
        </button>
      </div>
    </section>
  );
};

export default StepOne;
