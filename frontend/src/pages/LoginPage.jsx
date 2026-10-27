import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBackendErrors } from '../hooks/useBackendErrors';
import { FiMail, FiLock, FiAlertTriangle } from 'react-icons/fi';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Custom hook for backend errors
  const {
    generalError,
    handleBackendError,
    clearErrors,
    getFieldError,
    hasFieldError,
  } = useBackendErrors();

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    // No frontend validation check - submit directly and let backend validate
    try {
      await login(email.trim(), password);
    } catch (err) {
      handleBackendError(err);
    }
  };

  return (
    <div className="login-root">
      {/* Left Brand Panel */}
      <div className="login-brand-panel">
        <div className="login-brand-content">
          <h1 className="login-brand-title">
            Employee Portal
          </h1>
          <p className="login-brand-tagline">Employee Management System</p>
          <div className="login-feature-list">
            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Manage employee profiles & documents</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Advanced search, sort & filter</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Export to Excel & CSV</span>
            </div>
            <div className="login-feature">
              <span className="login-feature-icon">✓</span>
              <span>Bulk import from Excel / CSV</span>
            </div>
          </div>
        </div>
        <div className="login-brand-footer">
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>

      {/* Right Login Form Panel */}
      <div className="login-form-panel">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back 👋</h2>
            <p className="login-form-subtitle">Sign in to access the employee portal</p>
          </div>

          {generalError && (
            <div className="login-alert">
              <FiAlertTriangle className="login-alert-icon" />
              <span>{generalError}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Email Address
              </label>
              <div className="login-input-wrap">
                <FiMail className="login-input-icon" />
                <input
                  id="email"
                  type="email"
                  className={`login-input ${hasFieldError('email') ? 'login-input-error' : ''}`}
                  placeholder="admin@creativebees.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearErrors('email');
                  }}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {hasFieldError('email') && <p className="login-error-msg">{getFieldError('email')}</p>}
            </div>

            {/* Password */}
            <div className="login-field">
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <div className="login-input-wrap">
                <FiLock className="login-input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className={`login-input login-input-password ${hasFieldError('password') ? 'login-input-error' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearErrors('password');
                  }}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="login-show-password"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <BsEyeSlash size={16} /> : <BsEye size={16} />}
                </button>
              </div>
              {hasFieldError('password') && <p className="login-error-msg">{getFieldError('password')}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="login-spinner-wrap">
                  <span className="spinner"></span> Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="login-demo-box">
            <p className="login-demo-title">Demo Credentials</p>
            <div className="login-demo-row">
              <span className="login-demo-label">Email:</span>
              <button
                type="button"
                className="login-demo-value"
                onClick={() => {
                  setEmail('admin@creativebees.com');
                  clearErrors('email');
                }}
              >
                admin@creativebees.com
              </button>
            </div>
            <div className="login-demo-row">
              <span className="login-demo-label">Password:</span>
              <button
                type="button"
                className="login-demo-value"
                onClick={() => {
                  setPassword('Admin@123');
                  clearErrors('password');
                }}
              >
                Admin@123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
