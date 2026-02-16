import { createContext, useContext, useState } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projectData, setProjectData] = useState({
    projectType: '',
    location: '',
    buildingSize: '',
    floors: '',
    budget: '',
    timeline: '',
    notes: ''
  });

  const updateProjectData = (field, value) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
  };

  const resetProjectData = () => {
    setProjectData({
      projectType: '',
      location: '',
      buildingSize: '',
      floors: '',
      budget: '',
      timeline: '',
      notes: ''
    });
  };

  return (
    <ProjectContext.Provider value={{ projectData, updateProjectData, resetProjectData }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider');
  }
  return context;
};
