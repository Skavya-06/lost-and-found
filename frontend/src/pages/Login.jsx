import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  ShieldCheck,
  User,
  ArrowRight,
  Compass,
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login, loading, error: authError, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in both email and password.');
      return;
    }

    try {
      const result = await login(email, password);
      // If admin, default redirect to admin dashboard unless a specific page was requested
      if (result.user?.role === 'admin' && from === '/') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      // Error handled by context and local state
      console.error('Login error:', err);
    }
  };

  // Quick helper to fill demo credentials
  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLocalError('');
    clearError();
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
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to track your reported items and access community updates.
          </p>
        </div>

        {/* Error message */}
        {displayedError && (
          <div className="alert alert-error">
            <AlertCircle size={18} className="alert-icon" />
            <div className="alert-content">{displayedError}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon-left" />
              <input
                id="email"
                type="email"
                className="form-input with-left-icon"
                placeholder="e.g. yourname@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="password" className="form-label">
                Password
              </label>
            </div>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon-left" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input with-left-icon with-right-icon"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
          >
            {loading ? (
              <span className="btn-loading-flex">
                <span className="spinner-sm"></span> Signing In...
              </span>
            ) : (
              <span className="btn-loading-flex">
                <LogIn size={18} /> Sign In
              </span>
            )}
          </button>
        </form>

        {/* Demo Login Shortcuts */}
        <div className="demo-fill-box">
          <div className="demo-fill-title">
            <span>Quick Demo Access (1-Click Fill)</span>
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className="btn btn-outline btn-xs demo-btn"
              onClick={() => fillDemo('user@findit.com', 'password123')}
            >
              <User size={13} />
              <span>User Demo</span>
            </button>
            <button
              type="button"
              className="btn btn-outline btn-xs demo-btn"
              onClick={() => fillDemo('admin@findit.com', 'password123')}
            >
              <ShieldCheck size={13} />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        {/* Footer switch to register */}
        <div className="auth-footer">
          <span>Don’t have an account yet?</span>
          <Link to="/register" className="auth-link">
            <span>Create an account</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
