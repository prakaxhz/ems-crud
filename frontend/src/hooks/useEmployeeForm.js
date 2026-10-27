import { useState, useCallback } from 'react';
import { employeeService } from '../services/employeeService';
import { useBackendErrors } from './useBackendErrors';

export function useEmployeeForm({ mode = 'add', initialData = null, onSuccess, onClose } = {}) {
  const [formData, setFormData] = useState({
    employee_id: '',
    firstname: '',
    lastname: '',
    date_of_birth: '',
    education_qualification: 'B.Tech Computer Science',
    custom_qualification: '',
    address: '',
    email: '',
    phone: '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    errors,
    generalError,
    handleBackendError,
    clearErrors,
    getFieldError,
    hasFieldError,
  } = useBackendErrors();

  const resetForm = useCallback((nextId = '') => {
    setFormData({
      employee_id: nextId,
      firstname: '',
      lastname: '',
      date_of_birth: '',
      education_qualification: 'B.Tech Computer Science',
      custom_qualification: '',
      address: '',
      email: '',
      phone: '',
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setResumeFile(null);
    clearErrors();
  }, [clearErrors]);

  const loadInitialData = useCallback((data) => {
    if (!data) return;
    setFormData({
      employee_id: data.employee_id || '',
      firstname: data.firstname || '',
      lastname: data.lastname || '',
      date_of_birth: data.date_of_birth ? data.date_of_birth.substring(0, 10) : '',
      education_qualification: data.education_qualification || 'B.Tech Computer Science',
      custom_qualification: '',
      address: data.address || '',
      email: data.email || '',
      phone: data.phone || '',
    });
    setPhotoPreview(data.photo_url || null);
    setPhotoFile(null);
    setResumeFile(null);
    clearErrors();
  }, [clearErrors]);

  const fetchNextId = useCallback(async () => {
    try {
      const res = await employeeService.getNextId();
      if (res.success && res.next_id) {
        setFormData((prev) => ({ ...prev, employee_id: res.next_id }));
        return res.next_id;
      }
    } catch {
      // fallback
    }
    return '';
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearErrors(name);
  }, [clearErrors]);

  const handlePhotoSelect = useCallback((file) => {
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    clearErrors('photo');
  }, [clearErrors]);

  const handleResumeSelect = useCallback((file) => {
    if (!file) return;
    setResumeFile(file);
    clearErrors('resume');
  }, [clearErrors]);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    clearErrors();

    try {
      const payload = new FormData();
      payload.append('employee_id', formData.employee_id.trim());
      payload.append('firstname', formData.firstname.trim());
      payload.append('lastname', formData.lastname.trim());
      payload.append('date_of_birth', formData.date_of_birth);

      const finalQual =
        formData.education_qualification === 'Other / Custom'
          ? formData.custom_qualification.trim()
          : formData.education_qualification;
      payload.append('education_qualification', finalQual);

      payload.append('address', formData.address.trim());
      payload.append('email', formData.email.trim());
      payload.append('phone', formData.phone.trim());

      if (photoFile) {
        payload.append('photo', photoFile);
      }
      if (resumeFile) {
        payload.append('resume', resumeFile);
      }

      let res;
      if (mode === 'edit' && initialData?.id) {
        res = await employeeService.updateEmployee(initialData.id, payload);
      } else {
        res = await employeeService.createEmployee(payload);
      }

      onSuccess?.(res.message || (mode === 'edit' ? 'Employee updated!' : 'Employee added!'));
      onClose?.();
      return res;
    } catch (err) {
      handleBackendError(err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    photoFile,
    resumeFile,
    mode,
    initialData,
    onSuccess,
    onClose,
    clearErrors,
    handleBackendError,
  ]);

  return {
    formData,
    photoFile,
    photoPreview,
    resumeFile,
    isSubmitting,
    errors,
    generalError,
    handleChange,
    handlePhotoSelect,
    handleResumeSelect,
    submitForm,
    fetchNextId,
    loadInitialData,
    resetForm,
    getFieldError,
    hasFieldError,
  };
}

