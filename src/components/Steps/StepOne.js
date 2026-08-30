import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import ConfirmDialog from '../ui/ConfirmDialog';
import Icon from '../ui/Icon';

const StepOne = () => {
  const { projectData, updateProjectData, nextStep, resetProject } = useProject();
  const [showConfirm, setShowConfirm] = useState(false);

  const projectTypes = [
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'industrial', name: 'Industrial' }
  ];

  const handleKeyDown = (e, typeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      updateProjectData('projectType', typeId);
    }
  };

  const handleCancel = () => {
    if (projectData.projectType) {
      setShowConfirm(true);
    } else {
      resetProject();
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
            onKeyDown={(e) => handleKeyDown(e, type.id)}
            className={`project-type-card card-hover ${projectData.projectType === type.id ? 'selected' : ''}`}
            onClick={() => updateProjectData('projectType', type.id)}
          >
            <div className="project-type-icon" aria-hidden="true">
              <Icon
                name={type.id}
                size={38}
                color={projectData.projectType === type.id ? 'var(--primary)' : 'var(--text-secondary)'}
              />
            </div>
            <div className="project-type-name">{type.name}</div>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button 
          className="btn-secondary btn-hover"
          onClick={handleCancel}
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

      <ConfirmDialog
        isOpen={showConfirm}
        title="Leave project setup?"
        message="Your selected project type will be cleared."
        confirmText="Yes, leave"
        cancelText="Stay"
        onConfirm={() => {
          setShowConfirm(false);
          resetProject();
        }}
        onCancel={() => setShowConfirm(false)}
      />
    </section>
  );
};

export default StepOne;
