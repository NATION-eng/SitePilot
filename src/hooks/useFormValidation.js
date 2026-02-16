import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validate = (field, value) => {
    const newErrors = { ...errors };
    
    switch(field) {
      case 'projectType':
        if (!value) {
          newErrors.projectType = 'Please select a project type';
        } else {
          delete newErrors.projectType;
        }
        break;
        
      case 'location':
        if (!value || value.trim() === '') {
          newErrors.location = 'Location is required';
        } else if (value.length < 2) {
          newErrors.location = 'Location must be at least 2 characters';
        } else {
          delete newErrors.location;
        }
        break;
        
      case 'buildingSize':
        if (!value || value <= 0) {
          newErrors.buildingSize = 'Building size must be greater than 0';
        } else if (value > 100000) {
          newErrors.buildingSize = 'Building size seems unrealistic (max 100,000 sqm)';
        } else {
          delete newErrors.buildingSize;
        }
        break;
        
      case 'floors':
        if (!value || value < 1) {
          newErrors.floors = 'Must have at least 1 floor';
        } else if (value > 100) {
          newErrors.floors = 'Too many floors (max 100)';
        } else {
          delete newErrors.floors;
        }
        break;
        
      case 'budget':
        if (!value || value <= 0) {
          newErrors.budget = 'Budget must be greater than 0';
        } else if (value > 10000000000) {
          newErrors.budget = 'Budget seems unrealistic';
        } else {
          delete newErrors.budget;
        }
        break;
        
      case 'timeline':
        if (!value || value <= 0) {
          newErrors.timeline = 'Timeline must be greater than 0';
        } else if (value > 120) {
          newErrors.timeline = 'Timeline seems too long (max 120 months)';
        } else {
          delete newErrors.timeline;
        }
        break;
        
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMultiple = (fields) => {
    let allValid = true;
    fields.forEach(({ field, value }) => {
      const isValid = validate(field, value);
      if (!isValid) allValid = false;
    });
    return allValid;
  };

  const isValid = (fieldsToCheck, projectData) => {
    if (!projectData) return false;
    
    for (const field of fieldsToCheck) {
      if (!projectData[field] || errors[field]) {
        return false;
      }
    }
    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return { errors, validate, validateMultiple, isValid, clearErrors };
};
