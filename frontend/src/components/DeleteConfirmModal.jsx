import { FiTrash2, FiAlertTriangle, FiX } from 'react-icons/fi';

export default function DeleteConfirmModal({ employee, isOpen, isDeleting, onConfirm, onCancel }) {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel}>
          <FiX size={18} />
        </button>

        <div className="modal-header-danger">
          <div className="danger-icon-wrapper">
            <FiAlertTriangle size={28} />
          </div>
          <h3>Confirm Deletion</h3>
          <p>This action cannot be undone. All records and uploaded files for this employee will be permanently removed.</p>
        </div>

        <div className="delete-employee-preview">
          <div className="preview-avatar">
            {employee.photo ? (
              <img src={employee.photo_url} alt={employee.firstname} />
            ) : (
              <div className="avatar-placeholder">
                {employee.firstname?.charAt(0)}{employee.lastname?.charAt(0)}
              </div>
            )}
          </div>
          <div className="preview-info">
            <span className="badge-id">{employee.employee_id}</span>
            <h4 className="preview-name">{employee.firstname} {employee.lastname}</h4>
            <p className="preview-meta">{employee.email} • {employee.education_qualification}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(employee.id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner"></span> Deleting...
              </>
            ) : (
              <>
                <FiTrash2 size={16} /> Delete Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
