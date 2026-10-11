import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyItems, deleteItem, updateItemStatus } from '../api/items';
import { useAuth } from '../context/AuthContext';
import {
  FolderClock,
  PlusCircle,
  Edit3,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Tag,
  MapPin,
  Calendar,
} from 'lucide-react';

export default function MyItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);

  const loadMyItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyItems(user?.id);
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to load your reported items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyItems();
  }, [user]);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    setActionId(itemId);
    try {
      await deleteItem(itemId);
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
    } catch (err) {
      alert(err.message || 'Failed to delete report');
    } finally {
      setActionId(null);
    }
  };

  const handleToggleClaimed = async (item) => {
    const itemId = item._id || item.id;
    const nextStatus = item.status === 'CLAIMED' ? 'OPEN' : 'CLAIMED';
    setActionId(itemId);
    try {
      await updateItemStatus(itemId, nextStatus);
      setItems((prev) =>
        prev.map((i) => ((i._id || i.id) === itemId ? { ...i, status: nextStatus } : i))
      );
    } catch (err) {
      alert(err.message || 'Failed to update item status');
    } finally {
      setActionId(null);
    }
  };

  const openCount = items.filter((i) => i.status === 'OPEN').length;
  const claimedCount = items.filter((i) => i.status === 'CLAIMED').length;

  return (
    <div className="my-items-page-container">
      {/* Header */}
      <div className="my-items-header">
        <div>
          <div className="items-header-badge">
            <FolderClock size={14} />
            <span>Personal Dashboard</span>
          </div>
          <h1 className="items-page-title">My Reported Items</h1>
          <p className="items-page-subtitle">
            Manage your lost belongings and found item listings in one place.
          </p>
        </div>
        <Link to="/items/new" className="btn btn-primary btn-lg">
          <PlusCircle size={18} />
          <span>New Report</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="my-items-stats-row">
        <div className="stat-card-pill">
          <span className="stat-pill-label">Total Reports</span>
          <span className="stat-pill-value">{items.length}</span>
        </div>
        <div className="stat-card-pill pill-open">
          <span className="stat-pill-label">Active / Open</span>
          <span className="stat-pill-value">{openCount}</span>
        </div>
        <div className="stat-card-pill pill-claimed">
          <span className="stat-pill-label">Reunited / Claimed</span>
          <span className="stat-pill-value">{claimedCount}</span>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <div>{error}</div>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="items-loading-grid">
          <div className="spinner"></div>
          <p>Loading your reports...</p>
        </div>
      ) : items.length === 0 ? (
        /* Empty state */
        <div className="empty-items-state">
          <div className="empty-icon-wrap">
            <FolderClock size={36} />
          </div>
          <h3>You haven’t posted any reports yet</h3>
          <p>Misplaced something or found an item on campus? File a report in seconds.</p>
          <Link to="/items/new" className="btn btn-primary mt-3">
            <PlusCircle size={16} />
            <span>Create Your First Report</span>
          </Link>
        </div>
      ) : (
        /* Items List Cards */
        <div className="my-items-list">
          {items.map((item) => {
            const itemId = item._id || item.id;
            const isLost = item.type === 'LOST';

            return (
              <div key={itemId} className="my-item-row-card">
                <div className="my-item-left">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={item.title}
                    className="my-item-thumb"
                  />
                  <div className="my-item-info">
                    <div className="my-item-tags">
                      <span className={`badge-type ${isLost ? 'type-lost' : 'type-found'}`}>
                        {item.type}
                      </span>
                      <span
                        className={`badge-status ${
                          item.status === 'OPEN'
                            ? 'badge-status-open'
                            : item.status === 'CLAIMED'
                            ? 'badge-status-claimed'
                            : 'badge-status-closed'
                        }`}
                      >
                        {item.status}
                      </span>
                      <span className="badge badge-secondary">
                        <Tag size={11} /> {item.category}
                      </span>
                    </div>

                    <h3 className="my-item-title">
                      <Link to={`/items/${itemId}`}>{item.title}</Link>
                    </h3>

                    <div className="my-item-meta">
                      <span><MapPin size={13} /> {item.location}</span>
                      <span><Calendar size={13} /> {item.date}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="my-item-actions">
                  <button
                    type="button"
                    onClick={() => handleToggleClaimed(item)}
                    className={`btn btn-sm ${item.status === 'CLAIMED' ? 'btn-secondary' : 'btn-outline'}`}
                    disabled={actionId === itemId}
                    title="Toggle Claimed status"
                  >
                    <CheckCircle2 size={14} />
                    <span>{item.status === 'CLAIMED' ? 'Mark Open' : 'Mark Claimed'}</span>
                  </button>

                  <Link to={`/items/${itemId}`} className="btn btn-ghost btn-sm" title="View details">
                    <ExternalLink size={14} />
                  </Link>

                  <Link to={`/items/${itemId}/edit`} className="btn btn-secondary btn-sm" title="Edit">
                    <Edit3 size={14} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(itemId)}
                    className="btn btn-danger btn-sm"
                    disabled={actionId === itemId}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
