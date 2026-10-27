import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { HiUser } from 'react-icons/hi';
import { useAuth } from '../hooks/useAuth';

export default function Navbar({ onAddClick }) {
  const { user, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    setShowUserMenu(false);
    await logout();
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-wrap">
          <div className="brand-text">
            <h1 className="brand-title">Employee Management System</h1>
          </div>
        </div>

        <div className="header-right">
          <button type="button" className="btn btn-primary" onClick={onAddClick}>
            <FiPlus size={16} /> Add Employee
          </button>

          {/* User avatar dropdown */}
          <div className="dropdown-container">
            <button
              type="button"
              className="user-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
              title={user?.name || 'Account'}
            >
              <div className="user-avatar-circle">
                {user?.name?.charAt(0)?.toUpperCase() || <HiUser size={18} />}
              </div>
            </button>

            {showUserMenu && (
              <>
                <div className="dropdown-backdrop" onClick={() => setShowUserMenu(false)} />
                <div className="dropdown-menu dropdown-menu-right">
                  <div className="dropdown-user-info">
                    <p className="dropdown-user-name">{user?.name}</p>
                    <p className="dropdown-user-email">{user?.email}</p>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    type="button"
                    className="dropdown-item dropdown-item-danger"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing out...' : '↩ Sign Out'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
