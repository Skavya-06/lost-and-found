import { Search, Filter, X } from 'lucide-react';

export const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Bags & Backpacks',
  'Cards & IDs',
  'Keys',
  'Wallets & Purses',
  'Clothing & Accessories',
  'Books & Documents',
  'Jewelry & Watches',
  'Other',
];

export default function ItemFilterBar({
  search,
  setSearch,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  onReset,
}) {
  const hasActiveFilters =
    search || typeFilter !== 'ALL' || statusFilter !== 'ALL' || categoryFilter !== 'All Categories';

  return (
    <div className="filter-bar-container">
      {/* Search Bar */}
      <div className="filter-search-box">
        <Search size={18} className="search-box-icon" />
        <input
          type="text"
          className="search-box-input"
          placeholder="Search by keywords, title, location, description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filter Selectors Row */}
      <div className="filter-controls-row">
        {/* Type Toggle Pills */}
        <div className="filter-type-pills">
          <button
            type="button"
            className={`type-pill ${typeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setTypeFilter('ALL')}
          >
            All Reports
          </button>
          <button
            type="button"
            className={`type-pill type-pill-lost ${typeFilter === 'LOST' ? 'active' : ''}`}
            onClick={() => setTypeFilter('LOST')}
          >
            Lost Only
          </button>
          <button
            type="button"
            className={`type-pill type-pill-found ${typeFilter === 'FOUND' ? 'active' : ''}`}
            onClick={() => setTypeFilter('FOUND')}
          >
            Found Only
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="filter-dropdown-wrap">
          <label htmlFor="status-filter" className="sr-only">Status</label>
          <select
            id="status-filter"
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open (Active)</option>
            <option value="CLAIMED">Claimed</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Category Dropdown */}
        <div className="filter-dropdown-wrap">
          <label htmlFor="category-filter" className="sr-only">Category</label>
          <select
            id="category-filter"
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button type="button" onClick={onReset} className="btn btn-ghost btn-sm btn-reset-filters">
            <X size={14} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
