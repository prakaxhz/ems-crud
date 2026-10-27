import { useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { useBackendErrors } from './useBackendErrors';

export function useImportExcel({ onSuccess } = {}) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const { generalError, handleBackendError, clearErrors, setGeneralError } = useBackendErrors();

  const selectFile = useCallback((selected) => {
    clearErrors();
    setImportResult(null);
    if (!selected) {
      setFile(null);
      return;
    }
    const ext = selected.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'txt'].includes(ext)) {
      setGeneralError('Please select a valid .xlsx or .csv file.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setGeneralError('File size exceeds the 10MB limit.');
      return;
    }
    setFile(selected);
  }, [clearErrors, setGeneralError]);

  const uploadFile = useCallback(async () => {
    if (!file) return;
    setIsUploading(true);
    clearErrors();

    try {
      const res = await employeeService.importEmployees(file);
      setImportResult(res.data);
      onSuccess?.(res.message);
      return res;
    } catch (err) {
      handleBackendError(err);
      if (err.response?.data?.data) {
        setImportResult(err.response.data.data);
      }
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [file, clearErrors, onSuccess, handleBackendError]);

  const resetImport = useCallback(() => {
    setFile(null);
    setImportResult(null);
    clearErrors();
  }, [clearErrors]);

  return {
    file,
    isUploading,
    importResult,
    error: generalError,
    selectFile,
    uploadFile,
    resetImport,
  };
}

