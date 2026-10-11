import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, saveAuth } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [displayedError, setDisplayedError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDisplayedError('');

    if (!email || !password) {
      setDisplayedError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      const result = await loginUser({ email, password });
      saveAuth(result.token, result.user);
      if (result.user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setDisplayedError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-circle">
            
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Sign in to track your reported items and access community updates.
          </p>
        </div>

        {/* Error message */}
        {displayedError && (
          <div className="alert alert-error">
            
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
                {showPassword ? 'Hide' : 'Show'}
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
                 Sign In
              </span>
            )}
          </button>
        </form>

        {/* Footer switch to register */}
        <div className="auth-footer">
          <span>Don’t have an account yet?</span>
          <Link to="/register" className="auth-link">
            <span>Create an account</span>
            
          </Link>
        </div>
      </div>
    </div>
  );
}
