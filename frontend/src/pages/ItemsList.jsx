import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchItems } from '../api/items';
import ItemCard from '../components/items/ItemCard';
import ItemFilterBar from '../components/items/ItemFilterBar';
import { PlusCircle, Search, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get('type') || 'ALL';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');

  const { isAuthenticated } = useAuth();

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Failed to load lost and found items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleReset = () => {
    setSearch('');
    setTypeFilter('ALL');
    setStatusFilter('ALL');
    setCategoryFilter('All Categories');
    setSearchParams({});
  };

  // Client-side filtering & sorting
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Type filter
      if (typeFilter !== 'ALL' && item.type?.toUpperCase() !== typeFilter.toUpperCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'ALL' && item.status?.toUpperCase() !== statusFilter.toUpperCase()) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) {
        return false;
      }

      // Search keyword filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const locMatch = item.location?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !locMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [items, typeFilter, statusFilter, categoryFilter, search]);

  return (
    <div className="items-page-container">
      {/* Header Banner */}
      <div className="items-header-banner">
        <div className="items-header-left">
          <div className="items-header-badge">
            <Layers size={14} />
            <span>Community Directory</span>
          </div>
          <h1 className="items-page-title">Lost & Found Catalog</h1>
          <p className="items-page-subtitle">
            Browse active reports, filter by categories and locations, or report a lost item to the community.
          </p>
        </div>
        <div className="items-header-right">
          <Link
            to={isAuthenticated ? '/items/new' : '/login'}
            className="btn btn-primary btn-lg"
          >
            <PlusCircle size={18} />
            <span>Report an Item</span>
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <ItemFilterBar
        search={search}
        setSearch={setSearch}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onReset={handleReset}
      />

      {/* Filter status summary bar */}
      <div className="items-count-row">
        <span className="items-count-text">
          Showing <strong>{filteredItems.length}</strong> of {items.length} total reports
        </span>
        <button
          type="button"
          onClick={loadItems}
          className="btn btn-ghost btn-xs btn-refresh"
          title="Refresh items list"
        >
          <RefreshCw size={13} className={loading ? 'spin-icon' : ''} />
          <span>Refresh</span>
        </button>
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
          <p>Loading catalog items...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        /* Empty State */
        <div className="empty-items-state">
          <div className="empty-icon-wrap">
            <Search size={36} />
          </div>
          <h3>No items matched your search</h3>
          <p>
            Try adjusting your search keywords, clearing status filters, or browse other categories.
          </p>
          <div className="empty-actions-row">
            <button type="button" onClick={handleReset} className="btn btn-secondary">
              Clear All Filters
            </button>
            <Link to={isAuthenticated ? '/items/new' : '/login'} className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Report New Item</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Items Grid */
        <div className="items-grid">
          {filteredItems.map((item) => (
            <ItemCard key={item._id || item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
