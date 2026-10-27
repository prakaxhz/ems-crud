import { useState, useCallback } from 'react';

export function useBackendErrors() {
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  /**
   * Parse error response from Laravel / Axios
   * Handles 422 (validation errors), 401, 403, 404, 500, or network errors
   */
  const handleBackendError = useCallback((err) => {
    // Check if error response exists from Axios
    const responseData = err?.response?.data;

    if (responseData?.errors) {
      // Laravel validation errors object { field: [ "Error msg 1", ... ] }
      const fieldErrors = {};
      Object.entries(responseData.errors).forEach(([field, messages]) => {
        fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
      });
      setErrors(fieldErrors);
      setGeneralError(responseData.message && !responseData.message.includes('The given data was invalid.') ? responseData.message : '');
    } else if (responseData?.message) {
      setErrors({});
      setGeneralError(responseData.message);
    } else if (err?.message) {
      setErrors({});
      setGeneralError(err.message);
    } else {
      setErrors({});
      setGeneralError('An unexpected error occurred. Please try again.');
    }
  }, []);

  const clearErrors = useCallback((field = null) => {
    if (field) {
      setErrors((prev) => {
        if (!prev[field]) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    } else {
      setErrors({});
      setGeneralError('');
    }
  }, []);

  const getFieldError = useCallback((field) => errors[field] || '', [errors]);

  const hasFieldError = useCallback((field) => Boolean(errors[field]), [errors]);

  return {
    errors,
    generalError,
    handleBackendError,
    clearErrors,
    getFieldError,
    hasFieldError,
    setErrors,
    setGeneralError,
  };
}

