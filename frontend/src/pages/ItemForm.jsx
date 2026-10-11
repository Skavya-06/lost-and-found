import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createItem, fetchItemById, updateItem } from '../api/items';
import { getUser } from '../api/auth';
import { CATEGORIES } from '../components/items/ItemFilterBar';

const PRESET_IMAGES = [
  { label: 'Backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80' },
  { label: 'Phone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80' },
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Wallet', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80' },
  { label: 'Keys', url: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80' },
  { label: 'ID / Card', url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Laptop', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Water Bottle', url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80' },
];

export default function ItemForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const user = getUser();

  const [type, setType] = useState('LOST');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState(user?.email || '');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [status, setStatus] = useState('OPEN');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState(null);

  // If editing, load initial data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isEditing) {
      async function loadExisting() {
        setFetching(true);
        try {
          const item = await fetchItemById(id);
          setType(item.type || 'LOST');
          setTitle(item.title || '');
          setCategory(item.category || 'Electronics');
          setLocation(item.location || '');
          setDate(item.date || new Date().toISOString().split('T')[0]);
          setDescription(item.description || '');
          setContact(item.contact || user?.email || '');
          setImageUrl(item.imageUrl || '');
          setStatus(item.status || 'OPEN');
        } catch (err) {
          setError(err.message || 'Failed to load item for editing.');
        } finally {
          setFetching(false);
        }
      }
      loadExisting();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim() || !location.trim() || !description.trim()) {
      setError('Please fill in Title, Location, and Description fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        type,
        category,
        location: location.trim(),
        date,
        description: description.trim(),
        contact: contact.trim() || user?.email,
        imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
        status,
      };

      if (isEditing) {
        await updateItem(id, payload);
        navigate(`/items/${id}`, { replace: true });
      } else {
        const created = await createItem(payload);
        const newId = created._id || created.id;
        navigate(`/items/${newId}`, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit report. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="item-detail-loading">
        <div className="spinner"></div>
        <p>Loading report data...</p>
      </div>
    );
  }

  return (
    <div className="item-form-page-container">
      <div className="item-form-card">
        {/* Header */}
        <div className="form-header-bar">
          <Link to="/items" className="btn btn-ghost btn-sm">
            
            <span>Cancel</span>
          </Link>
          <div className="form-title-group">
            <h1 className="form-page-title">
              {isEditing ? 'Edit Item Report' : 'Post a Lost or Found Report'}
            </h1>
            <p className="form-page-subtitle">
              {isEditing
                ? 'Update information to help finders or owners track this item.'
                : 'Fill in accurate details to help community members reconnect with their belongings.'}
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error">
            
            <div>{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="item-form-body">
          {/* Item Type Selector */}
          <div className="form-group">
            <label className="form-label">Report Category Type *</label>
            <div className="type-selection-cards">
              <button
                type="button"
                className={`type-select-card card-lost ${type === 'LOST' ? 'active' : ''}`}
                onClick={() => setType('LOST')}
              >
                <div className="type-card-badge">LOST ITEM</div>
                <h3>I Lost Something</h3>
                <p>Broadcast details to the community so finders can reach you.</p>
              </button>

              <button
                type="button"
                className={`type-select-card card-found ${type === 'FOUND' ? 'active' : ''}`}
                onClick={() => setType('FOUND')}
              >
                <div className="type-card-badge">FOUND ITEM</div>
                <h3>I Found Something</h3>
                <p>Help return a misplaced belonging to its rightful owner.</p>
              </button>
            </div>
          </div>

          {/* Title & Category Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Item Title *
              </label>
              <div className="input-wrapper">
                
                <input
                  id="title"
                  type="text"
                  className="form-input with-left-icon"
                  placeholder="e.g. Navy Blue HydroFlask 32oz"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="category" className="form-label">
                Category *
              </label>
              <div className="input-wrapper">
                
                <select
                  id="category"
                  className="form-input with-left-icon"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {CATEGORIES.filter((c) => c !== 'All Categories').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Date Grid */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Location (Building, Room, Transit) *
              </label>
              <div className="input-wrapper">
                
                <input
                  id="location"
                  type="text"
                  className="form-input with-left-icon"
                  placeholder="e.g. Math Dept Room 104 or Bus Stop 7"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="date" className="form-label">
                Date {type === 'LOST' ? 'Lost' : 'Found'} *
              </label>
              <div className="input-wrapper">
                
                <input
                  id="date"
                  type="date"
                  className="form-input with-left-icon"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Detailed Description *
            </label>
            <textarea
              id="description"
              rows={4}
              className="form-input"
              placeholder="Describe color, size, brand, distinctive stickers, scratches, lock screen details, or case characteristics..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Contact Information */}
          <div className="form-group">
            <label htmlFor="contact" className="form-label">
              Contact Email / Phone (Shown to verified users)
            </label>
            <div className="input-wrapper">
              
              <input
                id="contact"
                type="text"
                className="form-input with-left-icon"
                placeholder="e.g. yourname@campus.edu or +1 555-0123"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          {/* Image & Presets */}
          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Photo URL / Visual Representation
            </label>
            <div className="input-wrapper">
              
              <input
                id="imageUrl"
                type="url"
                className="form-input with-left-icon"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            {/* Quick Preset Selector */}
            <div className="preset-images-wrapper">
              <span className="preset-label">Or choose a quick matching photo:</span>
              <div className="preset-chips-row">
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    className={`preset-chip ${imageUrl === preset.url ? 'active' : ''}`}
                    onClick={() => setImageUrl(preset.url)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="form-actions-bottom">
            <Link to="/items" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? (
                <span className="btn-loading-flex">
                  <span className="spinner-sm"></span> Saving...
                </span>
              ) : (
                <span>{isEditing ? 'Save Changes' : 'Publish Report'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
