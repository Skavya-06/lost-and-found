import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  const isLost = item.type === 'LOST';

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'OPEN':
        return 'badge-status-open';
      case 'CLAIMED':
        return 'badge-status-claimed';
      case 'CLOSED':
        return 'badge-status-closed';
      default:
        return 'badge-secondary';
    }
  };

  const itemId = item._id || item.id;

  return (
    <div className={`item-card ${isLost ? 'border-lost' : 'border-found'}`}>
      {/* Thumbnail or image */}
      <div className="item-card-image-wrap">
        <img
          src={
            item.imageUrl ||
            'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80'
          }
          alt={item.title}
          className="item-card-image"
          loading="lazy"
        />
        <div className="item-card-type-tag">
          <span className={`badge-type ${isLost ? 'type-lost' : 'type-found'}`}>
            {item.type}
          </span>
        </div>
        <div className="item-card-status-tag">
          <span className={`badge-status ${getStatusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="item-card-body">
        <div className="item-card-meta-top">
          <span className="item-card-category">
            
            <span>{item.category || 'General'}</span>
          </span>
          <span className="item-card-date">
            
            <span>{item.date || 'Recent'}</span>
          </span>
        </div>

        <h3 className="item-card-title">{item.title}</h3>

        <p className="item-card-desc">
          {item.description?.length > 100
            ? `${item.description.slice(0, 100)}...`
            : item.description || 'No additional details provided.'}
        </p>

        <div className="item-card-location">
          
          <span className="location-text">{item.location || 'Campus'}</span>
        </div>
      </div>

      {/* Footer link */}
      <div className="item-card-footer">
        <Link to={`/items/${itemId}`} className="btn-view-details">
          <span>View Details & Claim</span>
          
        </Link>
      </div>
    </div>
  );
}
