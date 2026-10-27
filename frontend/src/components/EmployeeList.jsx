import React, { useState } from 'react';
import {
  FiSearch,
  FiPlus,
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiX,
  FiFileText,
} from 'react-icons/fi';
import { LuArrowUpDown } from 'react-icons/lu';

const QUALIFICATION_OPTIONS = [
  { value: 'all', label: 'All Qualifications' },
  { value: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
  { value: 'B.Tech Information Technology', label: 'B.Tech IT' },
  { value: 'B.E Electronics & Communication', label: 'B.E ECE' },
  { value: 'MCA', label: 'MCA' },
  { value: 'BCA', label: 'BCA' },
  { value: 'B.Sc Computer Science', label: 'B.Sc CS' },
  { value: 'B.Sc Information Technology', label: 'B.Sc IT' },
  { value: 'M.Sc Data Science', label: 'M.Sc Data Science' },
  { value: 'MBA HR & Operations', label: 'MBA HR' },
];

export default function EmployeeList({
  employees = [],
  meta = {},
  loading = false,
  search = '',
  setSearch,
  qualification = 'all',
  setQualification,
  dobFrom = '',
  setDobFrom,
  dobTo = '',
  setDobTo,
  sortBy = 'id',
  sortDir = 'desc',
  onSort,
  page = 1,
  setPage,
  perPage = 10,
  setPerPage,
  onRefresh,
  onAddClick,
  onViewClick,
  onEditClick,
  onDeleteClick,
  onImportClick,
  onExport,
}) {
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleSortClick = (field) => {
    if (sortBy === field) {
      onSort(field, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setQualification('all');
    setDobFrom('');
    setDobTo('');
    setPage(1);
  };

  const hasActiveFilters = search || qualification !== 'all' || dobFrom || dobTo;

  return (
    <div className="card list-card">
      {/* List Toolbar / Header */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <h2 className="table-title">Employee Directory</h2>
          <span className="badge-count">{meta.total || 0} Total</span>
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className="btn btn-secondary btn-icon-sm"
            onClick={onRefresh}
            title="Refresh List"
          >
            <FiRefreshCw size={16} />
          </button>

          {/* Export Dropdown */}
          <div className="dropdown-container">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowExportMenu(!showExportMenu)}
            >
              <FiDownload size={16} /> Export <span className="dropdown-caret">▼</span>
            </button>

            {showExportMenu && (
              <div className="dropdown-menu">
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExport && onExport('xlsx');
                  }}
                >
                  <FiFileText size={16} /> Export as Excel (.xlsx)
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setShowExportMenu(false);
                    onExport && onExport('csv');
                  }}
                >
                  <FiFileText size={16} /> Export as CSV (.csv)
                </button>
              </div>
            )}
          </div>

          {/* Import Button */}
          <button type="button" className="btn btn-secondary" onClick={onImportClick}>
            <FiUpload size={16} /> Import Excel
          </button>

          {/* Add Employee Button */}
          <button type="button" className="btn btn-primary" onClick={onAddClick}>
            <FiPlus size={16} /> Add Employee
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="filter-bar">
        {/* Search input */}
        <div className="search-box">
          <FiSearch size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, ID, email, phone, qualification..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          {search && (
            <button
              className="clear-search-btn"
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Qualification Filter */}
        <div className="filter-select-wrap">
          <select
            className="filter-select"
            value={qualification}
            onChange={(e) => {
              setQualification(e.target.value);
              setPage(1);
            }}
          >
            {QUALIFICATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* DOB Range Filter */}
        <div className="dob-filter-group">
          <span className="filter-label">DOB:</span>
          <input
            type="date"
            className="filter-date-input"
            value={dobFrom}
            onChange={(e) => {
              setDobFrom(e.target.value);
              setPage(1);
            }}
            title="Born From"
          />
          <span className="filter-separator">-</span>
          <input
            type="date"
            className="filter-date-input"
            value={dobTo}
            onChange={(e) => {
              setDobTo(e.target.value);
              setPage(1);
            }}
            title="Born To"
          />
        </div>

        {hasActiveFilters && (
          <button type="button" className="btn btn-outline-sm btn-clear" onClick={handleClearFilters}>
            <FiX size={14} /> Clear
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th className="th-avatar">Photo</th>
              <th className="th-sortable" onClick={() => handleSortClick('employee_id')}>
                <div className="th-content">
                  <span>Employee ID</span>
                  <LuArrowUpDown
                    size={14}
                    className={`sort-icon ${sortBy === 'employee_id' ? 'sort-active' : ''}`}
                  />
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSortClick('firstname')}>
                <div className="th-content">
                  <span>Employee Name</span>
                  <LuArrowUpDown
                    size={14}
                    className={`sort-icon ${sortBy === 'firstname' ? 'sort-active' : ''}`}
                  />
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSortClick('education_qualification')}>
                <div className="th-content">
                  <span>Qualification</span>
                  <LuArrowUpDown
                    size={14}
                    className={`sort-icon ${sortBy === 'education_qualification' ? 'sort-active' : ''}`}
                  />
                </div>
              </th>
              <th className="th-sortable" onClick={() => handleSortClick('email')}>
                <div className="th-content">
                  <span>Email</span>
                  <LuArrowUpDown
                    size={14}
                    className={`sort-icon ${sortBy === 'email' ? 'sort-active' : ''}`}
                  />
                </div>
              </th>
              <th>Phone</th>
              <th className="th-sortable" onClick={() => handleSortClick('date_of_birth')}>
                <div className="th-content">
                  <span>Date of Birth</span>
                  <LuArrowUpDown
                    size={14}
                    className={`sort-icon ${sortBy === 'date_of_birth' ? 'sort-active' : ''}`}
                  />
                </div>
              </th>
              <th className="th-actions text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="table-status-cell">
                  <div className="table-loading">
                    <span className="spinner spinner-lg"></span>
                    <p>Loading employee data...</p>
                  </div>
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan="8" className="table-status-cell">
                  <div className="table-empty">
                    <div className="empty-icon-wrap">
                      <FiSearch size={32} />
                    </div>
                    <h4>No employees found</h4>
                    <p>
                      {hasActiveFilters
                        ? 'Try adjusting your search criteria or clear active filters.'
                        : 'Get started by registering your first employee.'}
                    </p>
                    {hasActiveFilters ? (
                      <button type="button" className="btn btn-secondary mt-3" onClick={handleClearFilters}>
                        Clear All Filters
                      </button>
                    ) : (
                      <button type="button" className="btn btn-primary mt-3" onClick={onAddClick}>
                        <FiPlus size={16} /> Add First Employee
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp.id} className="table-row">
                  <td className="td-avatar">
                    <div className="table-avatar-wrap" onClick={() => onViewClick(emp)}>
                      {emp.photo ? (
                        <img
                          src={emp.photo_url}
                          alt={emp.firstname}
                          className="table-avatar"
                        />
                      ) : (
                        <div className="table-avatar-placeholder">
                          {emp.firstname?.charAt(0)}{emp.lastname?.charAt(0)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="td-empid">
                    <span className="badge-id" onClick={() => onViewClick(emp)}>
                      {emp.employee_id}
                    </span>
                  </td>
                  <td className="td-name">
                    <div className="name-clickable" onClick={() => onViewClick(emp)}>
                      <span className="full-name">{emp.firstname} {emp.lastname}</span>
                      <span className="sub-address">{emp.address?.substring(0, 35)}...</span>
                    </div>
                  </td>
                  <td className="td-qual">
                    <span className="badge-qualification-sm">{emp.education_qualification}</span>
                  </td>
                  <td className="td-email">
                    <a href={`mailto:${emp.email}`} className="email-link">
                      <FiMail size={14} className="inline-icon" /> {emp.email}
                    </a>
                  </td>
                  <td className="td-phone">
                    <a href={`tel:${emp.phone}`} className="phone-link">
                      <FiPhone size={14} className="inline-icon" /> {emp.phone}
                    </a>
                  </td>
                  <td className="td-dob font-mono">{emp.date_of_birth}</td>
                  <td className="td-actions text-right">
                    <div className="actions-wrapper">
                      <button
                        type="button"
                        className="btn-action btn-view"
                        onClick={() => onViewClick(emp)}
                        title="View Details"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => onEditClick(emp)}
                        title="Edit Employee"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => onDeleteClick(emp)}
                        title="Delete Employee"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="pagination-bar">
        <div className="pagination-info">
          <span>
            Showing <strong>{meta.from || 0}</strong> to <strong>{meta.to || 0}</strong> of{' '}
            <strong>{meta.total || 0}</strong> entries
          </span>
          <div className="per-page-selector">
            <label>Per page:</label>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className="per-page-select"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div className="pagination-controls">
          <button
            type="button"
            className="btn-page"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <FiChevronLeft size={16} /> Prev
          </button>

          {Array.from({ length: meta.last_page || 1 }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === meta.last_page || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => {
              const prev = arr[idx - 1];
              const showEllipsis = prev && p - prev > 1;
              return (
                <React.Fragment key={p}>
                  {showEllipsis && <span className="pagination-ellipsis">...</span>}
                  <button
                    type="button"
                    className={`btn-page ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                </React.Fragment>
              );
            })}

          <button
            type="button"
            className="btn-page"
            disabled={page >= (meta.last_page || 1)}
            onClick={() => setPage((p) => Math.min(meta.last_page || 1, p + 1))}
          >
            Next <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
