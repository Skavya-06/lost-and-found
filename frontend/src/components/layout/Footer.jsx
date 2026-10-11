import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-inner">
        <div className="footer-col brand-col">
          <div className="brand-logo footer-brand">
            <div className="logo-icon-wrapper">
              
            </div>
            <span className="brand-name">FindIt</span>
          </div>
          <p className="footer-desc">
            A community-driven lost and found management platform. Helping people reconnect with
            their lost belongings quickly, safely, and transparently.
          </p>
          <div className="footer-badge">
            
            <span>Role-Based Secure JWT Auth</span>
          </div>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Platform</h4>
          <ul className="footer-nav-list">
            <li><Link to="/">Home Overview</Link></li>
            <li><Link to="/items">Browse All Items</Link></li>
            <li><Link to="/items/new">Report an Item</Link></li>
            <li><Link to="/my-items">My Reports</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Account & Access</h4>
          <ul className="footer-nav-list">
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
            <li><Link to="/profile">Profile Settings</Link></li>
            <li><Link to="/admin">Admin Dashboard</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Team & Project</h4>
          <p className="footer-meta-text">
            Developed with React 19, Vite, Express, and MongoDB Atlas.
          </p>
          <div className="team-pill-list">
            <span className="team-member-pill">Kavya (Lead)</span>
            <span className="team-member-pill">Anshika</span>
            <span className="team-member-pill">Bannsal</span>
          </div>
          <a
            href="https://github.com/ekanshbannsal/lost-and-found"
            target="_blank"
            rel="noreferrer"
            className="footer-github-link"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
            <span>GitHub Repository</span>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright-text">
          &copy; {new Date().getFullYear()} FindIt System. Built with{' '}
           for campus & community safety.
        </p>
      </div>
    </footer>
  );
}
