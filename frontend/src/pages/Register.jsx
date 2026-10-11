import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Compass,
} from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { register, login, loading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setSuccessMessage('');
    clearError();

    if (!name.trim() || !email.trim() || !password) {
      setLocalError('All fields marked with an asterisk are required.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    try {
      await register(name.trim(), email.trim(), password, role);
      setSuccessMessage('Account registered successfully! Logging you in...');

      // Automatically log the user in
      setTimeout(async () => {
        try {
          await login(email.trim(), password);
          if (role === 'admin') {
            navigate('/admin', { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        } catch {
          navigate('/login', { replace: true });
        }
      }, 1200);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const displayedError = localError || authError;

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-circle">
            <Compass size={28} className="text-primary" />
          </div>
          <h1 className="auth-title">Create an Account</h1>
          <p className="auth-subtitle">
            Join the FindIt community to report lost belongings or register found items.
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="alert alert-success">
            <CheckCircle size={18} className="alert-icon" />
            <div className="alert-content">{successMessage}</div>
          </div>
        )}

        {/* Error Alert */}
        {displayedError && !successMessage && (
          <div className="alert alert-error">
            <AlertCircle size={18} className="alert-icon" />
            <div className="alert-content">{displayedError}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name *
            </label>
            <div className="input-wrapper">
              <User size={18} className="input-icon-left" />
              <input
                id="name"
                type="text"
                className="form-input with-left-icon"
                placeholder="e.g. Alex Johnson"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address *
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon-left" />
              <input
                id="email"
                type="email"
                className="form-input with-left-icon"
                placeholder="e.g. alex@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password (min. 6 characters) *
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon-left" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input with-left-icon with-right-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="input-icon-right-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password *
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon-left" />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                className="form-input with-left-icon"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div className="form-group">
            <label className="form-label">Account Role</label>
            <div className="role-selector-grid">
              <button
                type="button"
                className={`role-option-card ${role === 'user' ? 'selected' : ''}`}
                onClick={() => setRole('user')}
              >
                <div className="role-option-header">
                  <User size={18} />
                  <span className="role-option-title">Standard User</span>
                </div>
                <p className="role-option-desc">Report lost/found items and manage personal claims.</p>
              </button>

              <button
                type="button"
                className={`role-option-card ${role === 'admin' ? 'selected' : ''}`}
                onClick={() => setRole('admin')}
              >
                <div className="role-option-header">
                  <ShieldCheck size={18} />
                  <span className="role-option-title">Admin / Staff</span>
                </div>
                <p className="role-option-desc">Manage all reports, change item statuses & moderation.</p>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg mt-3"
            disabled={loading || Boolean(successMessage)}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="spinner-sm"></span> Creating Account...
              </span>
            ) : (
              <span className="btn-loading-flex">
                <UserPlus size={18} /> Register Now
              </span>
            )}
          </button>
        </form>

        {/* Footer switch to login */}
        <div className="auth-footer">
          <span>Already have an account?</span>
          <Link to="/login" className="auth-link">
            <span>Sign in here</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
