import { useState, useCallback } from 'react';

/**
 * Pure validation helper that checks a single field value and returns an error string or null.
 */
export const validateFieldRule = (field, value) => {
  switch (field) {
    case 'projectType':
      if (!value) {
        return 'Please select a project type';
      }
      return null;

    case 'location': {
      const trimmed = typeof value === 'string' ? value.trim() : '';
      if (!trimmed) {
        return 'Location is required';
      }
      if (trimmed.length < 2) {
        return 'Location must be at least 2 characters';
      }
      if (trimmed.length > 100) {
        return 'Location must be 100 characters or fewer';
      }
      return null;
    }

    case 'buildingSize': {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Building size must be greater than 0';
      }
      if (num > 100000) {
        return 'Building size seems unrealistic (max 100,000 sqm)';
      }
      return null;
    }

    case 'floors': {
      const num = parseInt(value, 10);
      if (isNaN(num) || num < 1) {
        return 'Must have at least 1 floor';
      }
      if (num > 100) {
        return 'Too many floors (max 100)';
      }
      return null;
    }

    case 'budget': {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Budget must be greater than 0';
      }
      if (num > 10000000000) {
        return 'Budget seems unrealistic (max ₦10,000,000,000)';
      }
      return null;
    }

    case 'timeline': {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Timeline must be greater than 0';
      }
      if (num > 120) {
        return 'Timeline seems too long (max 120 months)';
      }
      return null;
    }

    default:
      return null;
  }
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  /**
   * Validates a single field and updates the error state atomically.
   * Returns true if valid, false if invalid.
   */
  const validate = useCallback((field, value) => {
    const errorMsg = validateFieldRule(field, value);
    setErrors((prevErrors) => {
      if (errorMsg) {
        return { ...prevErrors, [field]: errorMsg };
      }
      const updated = { ...prevErrors };
      delete updated[field];
      return updated;
    });
    return !errorMsg;
  }, []);

  /**
   * Validates multiple fields in a single atomic state update, eliminating stale closure race conditions.
   * @param {Array<{field: string, value: any}>} fields
   * @returns {boolean} true if all fields are valid
   */
  const validateMultiple = useCallback((fields) => {
    const calculatedErrors = {};
    let allValid = true;

    fields.forEach(({ field, value }) => {
      const errorMsg = validateFieldRule(field, value);
      if (errorMsg) {
        calculatedErrors[field] = errorMsg;
        allValid = false;
      }
    });

    setErrors((prevErrors) => {
      const updated = { ...prevErrors };
      // Remove any previously recorded errors for the fields being validated if they are now valid
      fields.forEach(({ field }) => {
        if (!calculatedErrors[field]) {
          delete updated[field];
        } else {
          updated[field] = calculatedErrors[field];
        }
      });
      return updated;
    });

    return allValid;
  }, []);

  /**
   * Checks whether the specified list of fields are present and valid in projectData.
   */
  const isValid = useCallback((fieldsToCheck, projectData) => {
    if (!projectData) return false;
    for (const field of fieldsToCheck) {
      const errorMsg = validateFieldRule(field, projectData[field]);
      if (errorMsg) return false;
    }
    return true;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return { errors, validate, validateMultiple, isValid, clearErrors };
};
