import React from 'react';
import { styles } from '../../styles';

const StepOne = ({ projectData, updateProjectData, nextStep, resetProject }) => {
  const projectTypes = [
    { id: 'residential', icon: '🏠', name: 'Residential' },
    { id: 'commercial', icon: '🏢', name: 'Commercial' },
    { id: 'industrial', icon: '🏭', name: 'Industrial' }
  ];

  return (
    <div className="fade-in">
      <h2 style={styles.sectionTitle}>Project Type</h2>
      <p style={styles.sectionSubtitle}>Select the type of construction project</p>
      
      <div className="responsive-grid-3">
        {projectTypes.map(type => (
          <div
            key={type.id}
            className="card-hover"
            style={{
              ...styles.projectTypeCard,
              ...(projectData.projectType === type.id ? styles.projectTypeCardSelected : {})
            }}
            onClick={() => updateProjectData('projectType', type.id)}
          >
            <div style={styles.projectTypeIcon}>{type.icon}</div>
            <div style={styles.projectTypeName}>{type.name}</div>
          </div>
        ))}
      </div>

      <div style={styles.buttonGroup}>
        <button style={styles.btnSecondary} onClick={resetProject} className="btn-hover">Cancel</button>
        <button
          className="btn-hover"
          style={{
            ...styles.btnPrimary,
            opacity: projectData.projectType ? 1 : 0.5,
            cursor: projectData.projectType ? 'pointer' : 'not-allowed'
          }}
          onClick={nextStep}
          disabled={!projectData.projectType}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepOne;
