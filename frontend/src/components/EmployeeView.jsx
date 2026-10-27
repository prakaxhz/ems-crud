import {
  FiX,
  FiEdit,
  FiTrash2,
  FiDownload,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiFileText,
  FiUser,
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { calculateAge } from '../utils/token';

export default function EmployeeView({ employee, isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen || !employee) return null;

  const age = calculateAge(employee.date_of_birth);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX size={18} />
        </button>

        {/* View Header with Hero Profile Banner */}
        <div className="profile-hero">
          <div className="profile-hero-bg"></div>
          <div className="profile-hero-body">
            <div className="profile-avatar-wrap">
              {employee.photo ? (
                <img
                  src={employee.photo_url}
                  alt={`${employee.firstname} ${employee.lastname}`}
                  className="profile-avatar"
                />
              ) : (
                <div className="profile-avatar-placeholder">
                  {employee.firstname?.charAt(0)}{employee.lastname?.charAt(0)}
                </div>
              )}
            </div>

            <div className="profile-hero-details">
              <div className="profile-badge-row">
                <span className="badge-id-large">{employee.employee_id}</span>
                <span className="badge-qualification">{employee.education_qualification}</span>
              </div>
              <h2 className="profile-name">
                {employee.firstname} {employee.lastname}
              </h2>
              <p className="profile-contact-line">
                <span><FiMail size={14} /> {employee.email}</span>
                <span>•</span>
                <span><FiPhone size={14} /> {employee.phone}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="profile-content-grid">
          {/* Card: Personal & Education */}
          <div className="info-card">
            <h4 className="info-card-title">
              <FiUser size={18} /> Personal Information
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{employee.firstname} {employee.lastname}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Employee ID</span>
                <span className="info-value font-mono">{employee.employee_id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Birth</span>
                <span className="info-value">
                  <FiCalendar size={14} className="inline-icon" />
                  {employee.date_of_birth} {age ? `(${age} years old)` : ''}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Education Qualification</span>
                <span className="info-value">
                  <FaGraduationCap size={14} className="inline-icon" />
                  {employee.education_qualification}
                </span>
              </div>
            </div>
          </div>

          {/* Card: Contact & Address */}
          <div className="info-card">
            <h4 className="info-card-title">
              <FiMapPin size={18} /> Contact & Residential Address
            </h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <a href={`mailto:${employee.email}`} className="info-link">
                  <FiMail size={14} className="inline-icon" /> {employee.email}
                </a>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <a href={`tel:${employee.phone}`} className="info-link">
                  <FiPhone size={14} className="inline-icon" /> {employee.phone}
                </a>
              </div>
              <div className="info-item col-span-2">
                <span className="info-label">Address</span>
                <p className="info-address-text">{employee.address}</p>
              </div>
            </div>
          </div>

          {/* Card: Documents & Attachments */}
          <div className="info-card col-span-full">
            <h4 className="info-card-title">
              <FiFileText size={18} /> Attached Documents
            </h4>
            <div className="docs-list">
              <div className="doc-item">
                <div className="doc-icon">
                  <FiFileText size={24} />
                </div>
                <div className="doc-info">
                  <span className="doc-name">Curriculum Vitae / Resume</span>
                  <span className="doc-meta">
                    {employee.resume ? 'Attached file' : 'No document uploaded'}
                  </span>
                </div>
                {employee.resume ? (
                  <a
                    href={employee.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-sm"
                    download
                  >
                    <FiDownload size={14} /> Download Resume
                  </a>
                ) : (
                  <span className="badge badge-gray">Not Provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* View Actions */}
        <div className="modal-actions-space">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={() => {
              onClose();
              onDelete(employee);
            }}
          >
            <FiTrash2 size={16} /> Delete
          </button>

          <div className="modal-actions-right">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              <FiEdit size={16} /> Edit Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
