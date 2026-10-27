import { useRef } from 'react';
import { FiUpload, FiX, FiDownload, FiAlertTriangle } from 'react-icons/fi';
import { useImportExcel } from '../hooks/useImportExcel';

export default function ImportModal({ isOpen, onClose, onSuccess }) {
  const {
    file,
    isUploading,
    importResult,
    error,
    selectFile,
    uploadFile,
    resetImport,
  } = useImportExcel({ onSuccess, onClose });

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      selectFile(e.dataTransfer.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const csvContent =
      'Employee ID,First Name,Last Name,Date of Birth,Education Qualification,Email,Phone,Address\n' +
      'EMP-1001,Raj,Kumar,1993-04-15,B.Tech Computer Science,raj.kumar@example.com,+91 9876500001,"45 Tech Park, Whitefield, Bengaluru"\n' +
      'EMP-1002,Meera,Iyer,1996-09-20,MCA,meera.iyer@example.com,+91 9876500002,"12 Gandhi Road, T Nagar, Chennai"\n' +
      'EMP-1003,Siddharth,Sharma,1991-12-05,MBA HR,siddharth.sharma@example.com,+91 9876500003,"78 Civil Lines, Jaipur"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'sample_employee_import.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadClick = () => {
    uploadFile().catch(() => {});
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={18} />
        </button>

        <div className="modal-header">
          <div className="icon-badge icon-badge-indigo">
            <FiUpload size={22} />
          </div>
          <div>
            <h3>Import Employees</h3>
            <p className="modal-subtitle">Upload an Excel (.xlsx) or CSV file with employee data</p>
          </div>
        </div>

        <div className="import-sample-bar">
          <span>Need the template format?</span>
          <button type="button" className="btn btn-outline-sm" onClick={handleDownloadSample}>
            <FiDownload size={14} /> Download Sample CSV
          </button>
        </div>

        {error && (
          <div className="alert alert-danger">
            <FiAlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}

        {importResult ? (
          <div className="import-result-box">
            <div className="import-result-header">
              <div className="result-stat success">
                <span className="stat-number">{importResult.imported_count || 0}</span>
                <span className="stat-label">Added</span>
              </div>
              <div className="result-stat info">
                <span className="stat-number">{importResult.updated_count || 0}</span>
                <span className="stat-label">Updated</span>
              </div>
              <div className="result-stat warning">
                <span className="stat-number">{importResult.skipped_count || 0}</span>
                <span className="stat-label">Skipped</span>
              </div>
            </div>

            {importResult.errors && importResult.errors.length > 0 && (
              <div className="import-errors-list">
                <h4>Row Notices / Errors:</h4>
                <ul>
                  {importResult.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={resetImport}>
                Import Another File
              </button>
              <button type="button" className="btn btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div
              className={`dropzone ${file ? 'dropzone-has-file' : ''}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .csv, .txt"
                className="hidden"
                style={{ display: 'none' }}
                onChange={(e) => selectFile(e.target.files?.[0])}
              />
              <div className="dropzone-inner">
                <FiUpload size={36} className="dropzone-icon" />
                {file ? (
                  <div className="dropzone-selected-file">
                    <p className="file-name">{file.name}</p>
                    <p className="file-size">{(file.size / 1024).toFixed(1)} KB</p>
                    <span className="file-badge">Ready to import</span>
                  </div>
                ) : (
                  <>
                    <p className="dropzone-title">Click to upload or drag & drop</p>
                    <p className="dropzone-hint">Supports Excel (.xlsx) and CSV (.csv) up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isUploading}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUploadClick}
                disabled={!file || isUploading}
              >
                {isUploading ? (
                  <>
                    <span className="spinner"></span> Processing File...
                  </>
                ) : (
                  <>
                    <FiUpload size={16} /> Import Data
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
