import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchItems, updateItemStatus, deleteItem } from '../api/items';
import { getUser } from '../api/auth';

export default function AdminDashboard() {
  const user = getUser();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const loadAllItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch items for admin view.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadAllItems();
  }, []);

  const handleStatusChange = async (itemId, newStatus) => {
    setActionId(itemId);
    try {
      await updateItemStatus(itemId, newStatus);
      setItems((prev) =>
        prev.map((i) => ((i._id || i.id) === itemId ? { ...i, status: newStatus } : i))
      );
      setStatusMessage(`Item status updated to ${newStatus}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update status');
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteItem = async (itemId, itemTitle) => {
    if (!window.confirm(`Permanently remove "${itemTitle}" from the system?`)) return;
    setActionId(itemId);
    try {
      await deleteItem(itemId);
      setItems((prev) => prev.filter((i) => (i._id || i.id) !== itemId));
      setStatusMessage('Item permanently deleted from database.');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      alert(err.message || 'Failed to delete item');
    } finally {
      setActionId(null);
    }
  };

  const total = items.length;
  const open = items.filter((i) => i.status === 'OPEN').length;
  const claimed = items.filter((i) => i.status === 'CLAIMED').length;
  const closed = items.filter((i) => i.status === 'CLOSED').length;
  const lost = items.filter((i) => i.type === 'LOST').length;
  const found = items.filter((i) => i.type === 'FOUND').length;
  const stats = { total, open, claimed, closed, lost, found };

  const filtered = items.filter((item) => {
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const t = item.title?.toLowerCase() || '';
      const d = item.description?.toLowerCase() || '';
      const l = item.location?.toLowerCase() || '';
      const u = item.user?.name?.toLowerCase() || '';
      const e = item.user?.email?.toLowerCase() || '';
      if (!t.includes(q) && !d.includes(q) && !l.includes(q) && !u.includes(q) && !e.includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-bar">
        <div>
          <div className="items-header-badge badge-admin-badge">
            
            <span>Administrator Control Center</span>
          </div>
          <h1 className="admin-page-title">Campus Moderation & Reports</h1>
          <p className="admin-page-subtitle">
            Oversee all lost and found submissions, resolve claim disputes, and update report statuses.
          </p>
        </div>
        <div className="admin-header-actions">
          <button
            type="button"
            onClick={loadAllItems}
            className="btn btn-secondary btn-sm"
            title="Refresh database"
          >
            
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Floating Status Toast */}
      {statusMessage && (
        <div className="alert alert-success admin-toast-alert">
          
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="alert alert-error">
          
          <div>{error}</div>
        </div>
      )}

      {/* Analytics KPI Cards */}
      <div className="admin-kpi-grid">
        <div className="kpi-card">
          <span className="kpi-label">Total Submissions</span>
          <span className="kpi-value">{stats.total}</span>
          <span className="kpi-sub">Lifetime registered</span>
        </div>

        <div className="kpi-card kpi-card-open">
          <span className="kpi-label">Active / Open</span>
          <span className="kpi-value text-warning">{stats.open}</span>
          <span className="kpi-sub">Awaiting resolution</span>
        </div>

        <div className="kpi-card kpi-card-claimed">
          <span className="kpi-label">Reunited / Claimed</span>
          <span className="kpi-value text-accent">{stats.claimed}</span>
          <span className="kpi-sub">Successfully returned</span>
        </div>

        <div className="kpi-card kpi-card-closed">
          <span className="kpi-label">Archived / Closed</span>
          <span className="kpi-value text-muted">{stats.closed}</span>
          <span className="kpi-sub">Completed lifecycle</span>
        </div>

        <div className="kpi-card">
          <span className="kpi-label">Type Distribution</span>
          <div className="kpi-dist-row">
            <span className="dist-badge dist-lost">Lost: {stats.lost}</span>
            <span className="dist-badge dist-found">Found: {stats.found}</span>
          </div>
          <span className="kpi-sub">Campus balance</span>
        </div>
      </div>

      {/* Management Table Section */}
      <div className="admin-table-card">
        {/* Table Filter Controls */}
        <div className="admin-filter-bar">
          <div className="admin-search-input-wrap">
            
            <input
              type="text"
              placeholder="Search reports or reporter name..."
              className="admin-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-filter-selectors">
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLAIMED">Claimed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        {/* Table or Empty */}
        {loading ? (
          <div className="items-loading-grid">
            <div className="spinner"></div>
            <p>Loading reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-items-state">
            
            <h3>No reports match the selected filters</h3>
            <p>Try resetting your search or filter settings.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Type</th>
                  <th>Reporter</th>
                  <th>Location & Date</th>
                  <th>Status (PUT /status)</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const itemId = item._id || item.id;
                  const isLost = item.type === 'LOST';

                  return (
                    <tr key={itemId} className={actionId === itemId ? 'row-busy' : ''}>
                      {/* Item Title & Thumb */}
                      <td className="item-cell">
                        <img
                          src={
                            item.imageUrl ||
                            'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=150&q=80'
                          }
                          alt=""
                          className="table-thumb"
                        />
                        <div className="table-item-info">
                          <Link to={`/items/${itemId}`} className="table-item-title">
                            {item.title}
                          </Link>
                          <span className="table-item-category">{item.category}</span>
                        </div>
                      </td>

                      {/* Type */}
                      <td>
                        <span className={`badge-type ${isLost ? 'type-lost' : 'type-found'}`}>
                          {item.type}
                        </span>
                      </td>

                      {/* Reporter */}
                      <td className="reporter-cell">
                        <span className="table-user-name">{item.user?.name || 'Anonymous'}</span>
                        <span className="table-user-email">{item.user?.email || 'N/A'}</span>
                      </td>

                      {/* Location & Date */}
                      <td className="location-cell">
                        <span className="table-location">{item.location}</span>
                        <span className="table-date">{item.date}</span>
                      </td>

                      {/* Status Selector */}
                      <td>
                        <select
                          className={`table-status-select ${
                            item.status === 'OPEN'
                              ? 'select-open'
                              : item.status === 'CLAIMED'
                              ? 'select-claimed'
                              : 'select-closed'
                          }`}
                          value={item.status}
                          disabled={actionId === itemId}
                          onChange={(e) => handleStatusChange(itemId, e.target.value)}
                        >
                          <option value="OPEN">OPEN</option>
                          <option value="CLAIMED">CLAIMED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="actions-cell text-right">
                        <div className="table-actions-group">
                          <Link
                            to={`/items/${itemId}`}
                            className="btn btn-ghost btn-xs"
                            title="View public page"
                          >
                            
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(itemId, item.title)}
                            className="btn btn-danger btn-xs"
                            disabled={actionId === itemId}
                            title="Delete permanently"
                          >
                            
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
