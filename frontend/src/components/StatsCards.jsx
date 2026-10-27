import { FiUser } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import { MdOutlineDateRange } from 'react-icons/md';

export default function StatsCards({ stats, total }) {
  const totalCount = total !== undefined ? total : stats?.total_employees || 0;
  const qualCount = stats?.qualifications_breakdown?.length || 0;
  const recentName = stats?.recent_employees?.[0]
    ? `${stats.recent_employees[0].firstname} ${stats.recent_employees[0].lastname}`
    : 'None';

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-icon icon-indigo">
          <FiUser size={24} />
        </div>
        <div className="stat-card-data">
          <span className="stat-card-label">Total Employees</span>
          <h3 className="stat-card-value">{totalCount}</h3>
          <span className="stat-card-sub text-success">Active in database</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon icon-amber">
          <FaGraduationCap size={24} />
        </div>
        <div className="stat-card-data">
          <span className="stat-card-label">Education Qualifications</span>
          <h3 className="stat-card-value">{qualCount}</h3>
          <span className="stat-card-sub text-muted">Distinct specializations</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon icon-emerald">
          <MdOutlineDateRange size={24} />
        </div>
        <div className="stat-card-data">
          <span className="stat-card-label">Latest Registration</span>
          <h3 className="stat-card-value text-truncate">{recentName}</h3>
          <span className="stat-card-sub text-muted">
            {stats?.recent_employees?.[0]?.employee_id || 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
}
