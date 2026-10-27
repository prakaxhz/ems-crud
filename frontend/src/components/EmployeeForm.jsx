import { useEffect, useRef } from 'react';
import {
  FiX,
  FiCheck,
  FiUser,
  FiUpload,
  FiFileText,
  FiAlertTriangle,
} from 'react-icons/fi';
import { useEmployeeForm } from '../hooks/useEmployeeForm';

const POPULAR_QUALIFICATIONS = [
  'B.Tech Computer Science',
  'B.Tech Information Technology',
  'B.E Electronics & Communication',
  'MCA',
  'BCA',
  'B.Sc Computer Science',
  'B.Sc Information Technology',
  'M.Sc Data Science',
  'M.Tech Software Engineering',
  'MBA HR & Operations',
  'MBA Marketing',
  'Other / Custom',
];

export default function EmployeeForm({ mode = 'add', initialData = null, isOpen, onClose, onSuccess }) {
  const {
    formData,
    photoFile,
    photoPreview,
    resumeFile,
    isSubmitting,
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
  } = useEmployeeForm({ mode, initialData, onSuccess, onClose });

  const photoInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  // Initialize or reset form state via hook methods
  useEffect(() => {
    if (!isOpen) return;

    if (mode === 'edit' && initialData) {
      loadInitialData(initialData);
    } else {
      resetForm();
      fetchNextId();
    }
  }, [isOpen, mode, initialData, loadInitialData, resetForm, fetchNextId]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm().catch(() => {});
  };

  const isEdit = mode === 'edit';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-form" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={18} />
        </button>

        <div className="modal-header">
          <div className="icon-badge icon-badge-indigo">
            <FiUser size={22} />
          </div>
          <div>
            <h3>{isEdit ? 'Edit Employee Details' : 'Add New Employee'}</h3>
            <p className="modal-subtitle">
              {isEdit ? `Updating profile for ${initialData?.employee_id}` : 'Fill in the information below to register a new employee'}
            </p>
          </div>
        </div>

        {generalError && (
          <div className="alert alert-danger">
            <FiAlertTriangle size={18} />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="form-wrapper">
          {/* Section: Basic Identity */}
          <div className="form-section">
            <h4 className="form-section-title">Identity & Identification</h4>

            <div className="form-row form-grid-3">
              <div className="form-group">
                <label className="form-label">
                  Employee ID <span className="req">*</span>
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    name="employee_id"
                    className={`form-input font-mono ${hasFieldError('employee_id') ? 'input-error' : ''}`}
                    placeholder="EMP-0001"
                    value={formData.employee_id}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                {hasFieldError('employee_id') && <p className="error-msg">{getFieldError('employee_id')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  First Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  className={`form-input ${hasFieldError('firstname') ? 'input-error' : ''}`}
                  placeholder="e.g. John"
                  value={formData.firstname}
                  onChange={handleChange}
                />
                {hasFieldError('firstname') && <p className="error-msg">{getFieldError('firstname')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  className={`form-input ${hasFieldError('lastname') ? 'input-error' : ''}`}
                  placeholder="e.g. Doe"
                  value={formData.lastname}
                  onChange={handleChange}
                />
                {hasFieldError('lastname') && <p className="error-msg">{getFieldError('lastname')}</p>}
              </div>
            </div>
          </div>

          {/* Section: Contact & Personal Details */}
          <div className="form-section">
            <h4 className="form-section-title">Contact & Personal Details</h4>

            <div className="form-row form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Email Address <span className="req">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${hasFieldError('email') ? 'input-error' : ''}`}
                  placeholder="john.doe@company.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {hasFieldError('email') && <p className="error-msg">{getFieldError('email')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone Number <span className="req">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${hasFieldError('phone') ? 'input-error' : ''}`}
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {hasFieldError('phone') && <p className="error-msg">{getFieldError('phone')}</p>}
              </div>
            </div>

            <div className="form-row form-grid-2">
              <div className="form-group">
                <label className="form-label">
                  Date of Birth <span className="req">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  className={`form-input ${hasFieldError('date_of_birth') ? 'input-error' : ''}`}
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
                {hasFieldError('date_of_birth') && <p className="error-msg">{getFieldError('date_of_birth')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Education Qualification <span className="req">*</span>
                </label>
                <select
                  name="education_qualification"
                  className={`form-select ${hasFieldError('education_qualification') ? 'input-error' : ''}`}
                  value={formData.education_qualification}
                  onChange={handleChange}
                >
                  {POPULAR_QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
                {formData.education_qualification === 'Other / Custom' && (
                  <input
                    type="text"
                    name="custom_qualification"
                    className="form-input mt-2"
                    placeholder="Enter qualification (e.g. B.Com Finance)"
                    value={formData.custom_qualification}
                    onChange={handleChange}
                  />
                )}
                {hasFieldError('education_qualification') && (
                  <p className="error-msg">{getFieldError('education_qualification')}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Residential Address <span className="req">*</span>
              </label>
              <textarea
                name="address"
                rows="3"
                className={`form-textarea ${hasFieldError('address') ? 'input-error' : ''}`}
                placeholder="Door No, Street name, Area, City, State, PIN Code"
                value={formData.address}
                onChange={handleChange}
              ></textarea>
              {hasFieldError('address') && <p className="error-msg">{getFieldError('address')}</p>}
            </div>
          </div>

          {/* Section: Photo & Documents */}
          <div className="form-section">
            <h4 className="form-section-title">Photo & Document Uploads</h4>

            <div className="form-row form-grid-2">
              {/* Photo Upload */}
              <div className="form-group">
                <label className="form-label">Profile Photo</label>
                <div className="file-upload-card">
                  <div className="photo-preview-box">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="img-cover" />
                    ) : (
                      <div className="photo-preview-placeholder">
                        <FiUser size={32} />
                      </div>
                    )}
                  </div>
                  <div className="file-upload-meta">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handlePhotoSelect(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-sm"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <FiUpload size={14} /> {photoPreview ? 'Change Photo' : 'Upload Photo'}
                    </button>
                    <p className="file-hint">JPG, PNG, WEBP</p>
                    {photoFile && <p className="file-selected-name">{photoFile.name}</p>}
                  </div>
                </div>
                {hasFieldError('photo') && <p className="error-msg">{getFieldError('photo')}</p>}
              </div>

              {/* Resume Upload */}
              <div className="form-group">
                <label className="form-label">Resume / CV (PDF or DOC)</label>
                <div className="file-upload-card">
                  <div className="resume-icon-box">
                    <FiFileText size={32} />
                  </div>
                  <div className="file-upload-meta">
                    <input
                      ref={resumeInputRef}
                      type="file"
                      accept=".pdf, .doc, .docx"
                      style={{ display: 'none' }}
                      onChange={(e) => handleResumeSelect(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-sm"
                      onClick={() => resumeInputRef.current?.click()}
                    >
                      <FiUpload size={14} /> {resumeFile || initialData?.resume ? 'Change Resume' : 'Upload Resume'}
                    </button>
                    <p className="file-hint">PDF or Word document</p>
                    {resumeFile ? (
                      <p className="file-selected-name">{resumeFile.name}</p>
                    ) : isEdit && initialData?.resume ? (
                      <a
                        href={initialData?.resume_url}
                        target="_blank"
                        rel="noreferrer"
                        className="file-existing-link"
                      >
                        Current: Resume.pdf
                      </a>
                    ) : null}
                  </div>
                </div>
                {hasFieldError('resume') && <p className="error-msg">{getFieldError('resume')}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span> Saving...
                </>
              ) : (
                <>
                  <FiCheck size={16} /> {isEdit ? 'Update Employee' : 'Create Employee'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
