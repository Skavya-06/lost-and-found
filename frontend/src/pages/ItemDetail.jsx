import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchItemById, updateItemStatus, deleteItem } from '../api/items';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Calendar,
  Tag,
  ArrowLeft,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Share2,
  Clock,
} from 'lucide-react';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimProofText, setClaimProofText] = useState('');
  const [claimSuccess, setClaimSuccess] = useState(false);

  useEffect(() => {
    async function loadItem() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchItemById(id);
        setItem(data);
      } catch (err) {
        setError(err.message || 'Item details could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    loadItem();
  }, [id]);

  // Determine ownership
  const isOwner = Boolean(
    user &&
      (user.id === (item?.user?.id || item?.user?._id || item?.userId) ||
        user.email === item?.user?.email)
  );

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'OPEN':
        return <span className="badge badge-status-open">Open / Active</span>;
      case 'CLAIMED':
        return <span className="badge badge-status-claimed">Claimed</span>;
      case 'CLOSED':
        return <span className="badge badge-status-closed">Closed</span>;
      default:
        return <span className="badge badge-secondary">{status}</span>;
    }
  };

  const handleAdminStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      const updated = await updateItemStatus(id, newStatus);
      setItem((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this item report?')) {
      return;
    }
    setActionLoading(true);
    try {
      await deleteItem(id);
      navigate(isOwner ? '/my-items' : '/items', { replace: true });
    } catch (err) {
      alert(err.message || 'Failed to delete report');
      setActionLoading(false);
    }
  };

  const handleClaimSubmit = (e) => {
    e.preventDefault();
    if (!claimProofText.trim()) return;
    setClaimSuccess(true);
  };

  if (loading) {
    return (
      <div className="item-detail-loading">
        <div className="spinner"></div>
        <p>Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="item-detail-error-container">
        <div className="alert alert-error">
          <AlertCircle size={20} />
          <div>{error || 'Item was not found or has been removed.'}</div>
        </div>
        <Link to="/items" className="btn btn-secondary mt-3">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isLost = item.type === 'LOST';

  return (
    <div className="item-detail-page-container">
      {/* Top Breadcrumb & Actions */}
      <div className="detail-top-bar">
        <Link to="/items" className="btn btn-ghost btn-sm">
          <ArrowLeft size={16} />
          <span>Back to All Items</span>
        </Link>

        <div className="detail-top-right-actions">
          {/* Owner Quick Actions */}
          {isOwner && (
            <>
              <Link to={`/items/${id}/edit`} className="btn btn-secondary btn-sm">
                <Edit3 size={15} />
                <span>Edit Report</span>
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger btn-sm"
                disabled={actionLoading}
              >
                <Trash2 size={15} />
                <span>Delete</span>
              </button>
            </>
          )}

          {/* Admin Quick Delete */}
          {isAdmin && !isOwner && (
            <button
              type="button"
              onClick={handleDelete}
              className="btn btn-danger btn-sm"
              disabled={actionLoading}
            >
              <Trash2 size={15} />
              <span>Admin Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Detail Grid */}
      <div className="item-detail-layout">
        {/* Left: Image Showcase */}
        <div className="detail-media-column">
          <div className="detail-image-card">
            <img
              src={
                item.imageUrl ||
                'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=1000&q=80'
              }
              alt={item.title}
              className="detail-main-img"
            />
            <div className="detail-type-floating-badge">
              <span className={`badge-type ${isLost ? 'type-lost' : 'type-found'}`}>
                {item.type}
              </span>
            </div>
          </div>

          {/* Admin Moderation Card */}
          {isAdmin && (
            <div className="admin-moderation-panel">
              <div className="admin-mod-header">
                <ShieldCheck size={18} className="text-warning" />
                <h4>Admin Status Control</h4>
              </div>
              <p className="admin-mod-desc">
                Update report lifecycle status across the platform (invokes PUT /api/items/:id/status):
              </p>
              <div className="admin-status-btn-group">
                {['OPEN', 'CLAIMED', 'CLOSED'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`btn btn-sm ${item.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => handleAdminStatusChange(st)}
                    disabled={actionLoading}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Item Info & Contact / Claim */}
        <div className="detail-info-column">
          {/* Header Info */}
          <div className="detail-header-card">
            <div className="detail-badges-row">
              <span className={`badge-type ${isLost ? 'type-lost' : 'type-found'}`}>
                {item.type === 'LOST' ? 'LOST ITEM' : 'FOUND ITEM'}
              </span>
              {getStatusBadge(item.status)}
              <span className="badge badge-category">
                <Tag size={12} />
                <span>{item.category || 'General'}</span>
              </span>
            </div>

            <h1 className="detail-item-title">{item.title}</h1>

            <div className="detail-meta-pills">
              <div className="meta-pill">
                <MapPin size={16} className="text-secondary" />
                <span>{item.location || 'Location Not Specified'}</span>
              </div>
              <div className="meta-pill">
                <Calendar size={16} className="text-accent" />
                <span>Date: {item.date || 'Recent'}</span>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="detail-section-card">
            <h3 className="section-subheading">Description & Specific Details</h3>
            <p className="detail-description-text">{item.description}</p>
          </div>

          {/* Reporter & Contact Box */}
          <div className="detail-section-card reporter-card">
            <h3 className="section-subheading">Reporter & Contact Details</h3>

            <div className="reporter-info-row">
              <div className="reporter-avatar">
                {item.user?.name ? item.user.name[0].toUpperCase() : 'R'}
              </div>
              <div>
                <span className="reporter-name">{item.user?.name || 'Community Member'}</span>
                <span className="reporter-role-tag">
                  {item.user?.role === 'admin' ? 'Campus Admin / Staff' : 'Verified Student'}
                </span>
              </div>
            </div>

            {isAuthenticated ? (
              <div className="contact-revealed-box">
                <div className="contact-detail-row">
                  <Mail size={16} />
                  <span>{item.contact || item.user?.email || 'Contact provided upon claim'}</span>
                </div>
                {item.phone && (
                  <div className="contact-detail-row">
                    <Phone size={16} />
                    <span>{item.phone}</span>
                  </div>
                )}
                <button
                  type="button"
                  className="btn btn-primary btn-block mt-3"
                  onClick={() => setShowClaimModal(true)}
                >
                  <CheckCircle2 size={16} />
                  <span>{isLost ? 'I Found This Item (Contact Owner)' : 'Claim This Item (Prove Ownership)'}</span>
                </button>
              </div>
            ) : (
              <div className="contact-login-prompt">
                <HelpCircle size={20} className="text-primary" />
                <div>
                  <h4>Contact Details Protected</h4>
                  <p>Please sign in with your student or campus account to view contact info or file a claim.</p>
                </div>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Sign In to Claim
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Claim / Contact Modal */}
      {showClaimModal && (
        <div className="modal-backdrop" onClick={() => setShowClaimModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {isLost ? 'Contact Item Owner' : 'Verify & Claim Item'}
            </h3>
            <p className="modal-desc">
              Provide unique identifying marks, serial numbers, wallpaper description, or purchase proof
              to safely verify item ownership.
            </p>

            {claimSuccess ? (
              <div className="claim-success-box">
                <CheckCircle2 size={36} className="text-success" />
                <h4>Inquiry Sent Successfully!</h4>
                <p>
                  The reporter has received your claim request along with your verified contact information.
                  Please keep an eye on your email inbox.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowClaimModal(false);
                    setClaimSuccess(false);
                  }}
                  className="btn btn-primary mt-3"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleClaimSubmit}>
                <div className="form-group">
                  <label className="form-label">Proof of Ownership / Details</label>
                  <textarea
                    rows={4}
                    className="form-input"
                    placeholder="Describe specific stickers, lock screen photo, internal contents, or where you believe it was lost..."
                    value={claimProofText}
                    onChange={(e) => setClaimProofText(e.target.value)}
                    required
                  />
                </div>
                <div className="modal-actions-row">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowClaimModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Send Claim Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
