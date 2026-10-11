import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clearAuth, getUser } from '../../api/auth';

export default function Navbar() {
  const [user, setUser] = useState(getUser());
  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === 'admin';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setUser(getUser());
  }, [location.pathname]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <div className="logo-icon-wrapper">
            
          </div>
          <div className="brand-text">
            <span className="brand-name">FindIt</span>
            <span className="brand-tag">Lost & Found</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links desktop-only">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/items" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            
            <span>Browse Items</span>
          </NavLink>

          {isAuthenticated && (
            <>
              <NavLink to="/items/new" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                
                <span>Report Item</span>
              </NavLink>
              <NavLink to="/my-items" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                
                <span>My Reports</span>
              </NavLink>
            </>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'nav-link active admin-link' : 'nav-link admin-link')}>
              
              <span>Admin Panel</span>
              <span className="badge badge-admin">Admin</span>
            </NavLink>
          )}
        </nav>

        {/* Right Actions */}
        <div className="nav-auth-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="user-pill" title="View Profile">
                <div className="user-avatar">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="user-info-snippet">
                  <span className="user-name-text">{user?.name}</span>
                  <span className={`user-role-badge ${isAdmin ? 'role-admin' : 'role-user'}`}>
                    {isAdmin ? 'Admin' : 'User'}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-ghost btn-sm"
                title="Log out"
              >
                
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu-btn mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav-links">
            <NavLink to="/" end onClick={closeMenu} className="mobile-nav-link">
              Home
            </NavLink>
            <NavLink to="/items" onClick={closeMenu} className="mobile-nav-link">
              
              <span>Browse Items</span>
            </NavLink>

            {isAuthenticated && (
              <>
                <NavLink to="/items/new" onClick={closeMenu} className="mobile-nav-link">
                  
                  <span>Report Item</span>
                </NavLink>
                <NavLink to="/my-items" onClick={closeMenu} className="mobile-nav-link">
                  
                  <span>My Reports</span>
                </NavLink>
                <NavLink to="/profile" onClick={closeMenu} className="mobile-nav-link">
                  
                  <span>My Profile ({user?.name})</span>
                </NavLink>
              </>
            )}

            {isAdmin && (
              <NavLink to="/admin" onClick={closeMenu} className="mobile-nav-link admin-link">
                
                <span>Admin Panel</span>
                <span className="badge badge-admin">Admin</span>
              </NavLink>
            )}

            <div className="mobile-auth-divider"></div>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-danger w-full mt-2"
              >
                
                <span>Logout ({user?.name})</span>
              </button>
            ) : (
              <div className="mobile-auth-btn-stack">
                <Link to="/login" onClick={closeMenu} className="btn btn-secondary w-full">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeMenu} className="btn btn-primary w-full">
                  
                  <span>Create Account</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
