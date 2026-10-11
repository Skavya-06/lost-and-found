import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <div className="not-found-icon-wrap">
          <Compass size={48} className="text-accent" />
        </div>
        <span className="error-code">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-text">
          Looks like this page got lost! Don’t worry, we can help you find your way back.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Back to Home</span>
          </Link>
          <Link to="/items" className="btn btn-secondary">
            <Search size={16} />
            <span>Browse Lost & Found</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
