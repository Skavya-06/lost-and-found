import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, KeyRound, LogOut, FileText, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-circle">
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div className="profile-title-group">
            <h1 className="profile-name">{user?.name}</h1>
            <p className="profile-email">{user?.email}</p>
            <div className="profile-badge-row">
              <span className={`badge ${isAdmin ? 'badge-admin' : 'badge-user'}`}>
                {isAdmin ? 'Administrator' : 'Standard User'}
              </span>
              <span className="badge badge-verified">
                <CheckCircle2 size={12} /> Verified Session
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="profile-details-grid">
          <div className="detail-item">
            <div className="detail-icon"><User size={18} /></div>
            <div className="detail-info">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{user?.name || 'Not provided'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon"><Mail size={18} /></div>
            <div className="detail-info">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{user?.email || 'Not provided'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon"><Shield size={18} /></div>
            <div className="detail-info">
              <span className="detail-label">Account Role</span>
              <span className="detail-value text-capitalize">{user?.role || 'user'}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon"><KeyRound size={18} /></div>
            <div className="detail-info">
              <span className="detail-label">User Identifier</span>
              <span className="detail-value text-mono">{user?.id || user?._id || 'USR-LOCAL'}</span>
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="profile-actions-box">
          <h3 className="profile-actions-title">Quick Actions</h3>
          <div className="profile-btn-row">
            <Link to="/my-items" className="btn btn-secondary">
              <FileText size={16} />
              <span>Manage My Reports</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn btn-primary">
                <Shield size={16} />
                <span>Open Admin Panel</span>
              </Link>
            )}
            <button type="button" onClick={handleLogout} className="btn btn-danger">
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
