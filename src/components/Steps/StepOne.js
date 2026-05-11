import React from 'react';
import { useProject } from '../../context/ProjectContext';

const StepOne = () => {
  const { projectData, updateProjectData, nextStep, resetProject } = useProject();

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
      <h2 id="step-one-title" className="section-title">Project Type</h2>
      <p className="section-subtitle">Select the type of construction project</p>
      
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
            className={`project-type-card card-hover ${projectData.projectType === type.id ? 'selected' : ''}`}
            onClick={() => updateProjectData('projectType', type.id)}
          >
            <div className="project-type-icon" aria-hidden="true">{type.icon}</div>
            <div className="project-type-name">{type.name}</div>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button 
          className="btn-secondary btn-hover"
          onClick={resetProject}
          aria-label="Cancel and return to home"
        >
          Cancel
        </button>
        <button
          className={`btn-primary btn-hover ${!projectData.projectType ? 'disabled' : ''}`}
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
