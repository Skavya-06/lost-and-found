import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  PlusCircle,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Users,
  Compass,
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, user, isAdmin } = useAuth();

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={14} className="hero-sparkle" />
          <span>Campus & Community Lost and Found Hub</span>
        </div>

        <h1 className="hero-title">
          Lost Something? <br />
          <span className="gradient-text">We’ll Help You Find It.</span>
        </h1>

        <p className="hero-subtitle">
          A modern, role-secured platform to report lost belongings, log found items, and safely
          reconnect them with verified owners in minutes.
        </p>

        <div className="hero-cta-group">
          <Link to="/items" className="btn btn-primary btn-lg">
            <Search size={18} />
            <span>Browse Lost & Found</span>
          </Link>
          <Link to={isAuthenticated ? '/items/new' : '/login'} className="btn btn-secondary btn-lg">
            <PlusCircle size={18} />
            <span>Report an Item</span>
          </Link>
        </div>

        {/* Quick User Greeting if logged in */}
        {isAuthenticated && (
          <div className="hero-user-banner">
            <span>Welcome back, <strong>{user?.name}</strong>!</span>
            {isAdmin && <span className="badge badge-admin ml-2">Admin privileges active</span>}
            <Link to={isAdmin ? '/admin' : '/my-items'} className="hero-user-banner-link">
              Go to {isAdmin ? 'Admin Dashboard' : 'My Reports'} <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* Highlight Stats */}
        <div className="hero-stats-grid">
          <div className="stat-card">
            <div className="stat-value">98%</div>
            <div className="stat-label">Recovery Rate</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">&lt; 24h</div>
            <div className="stat-label">Average Match Time</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-label">Verified Owners</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">24/7</div>
            <div className="stat-label">Community Access</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="workflow-section">
        <div className="section-header">
          <span className="section-kicker">Simple & Transparent</span>
          <h2 className="section-title">How FindIt Works</h2>
          <p className="section-desc">Reconnecting lost possessions through 4 simple steps.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-box">
              <PlusCircle size={22} />
            </div>
            <h3 className="step-heading">Post a Report</h3>
            <p className="step-body">
              Log details of the lost or found item with location, date, category, and description.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-box">
              <Search size={22} />
            </div>
            <h3 className="step-heading">Search & Filter</h3>
            <p className="step-body">
              Easily filter items by type (LOST / FOUND), status, keywords, or location.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-box">
              <ShieldCheck size={22} />
            </div>
            <h3 className="step-heading">Verify & Claim</h3>
            <p className="step-body">
              Contact the finder with specific proof of ownership to authenticate the claim.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon-box">
              <CheckCircle2 size={22} />
            </div>
            <h3 className="step-heading">Item Reunited</h3>
            <p className="step-body">
              Status changes to CLAIMED and CLOSED, completing the cycle safely.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon"><ShieldCheck size={20} /></div>
            <div>
              <h4 className="feature-title">Role-Based Access Control</h4>
              <p className="feature-text">JWT authenticated access protecting user personal contact details.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Clock size={20} /></div>
            <div>
              <h4 className="feature-title">Live Status Updates</h4>
              <p className="feature-text">Real-time status tracking across OPEN, CLAIMED, and CLOSED states.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Users size={20} /></div>
            <div>
              <h4 className="feature-title">Admin Moderation</h4>
              <p className="feature-text">Designated admins review reports, maintain community safety, and manage spam.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Compass size={20} /></div>
            <div>
              <h4 className="feature-title">Location Tagging</h4>
              <p className="feature-text">Pinpoint library, cafeteria, campus grounds, or public transport transit stops.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA Bottom */}
      <section className="bottom-cta-banner">
        <div className="bottom-cta-content">
          <h2>Ready to help someone or find your belongings?</h2>
          <p>Join our community today and turn lost into found.</p>
          <div className="bottom-cta-actions">
            {!isAuthenticated ? (
              <>
                <Link to="/register" className="btn btn-primary">
                  Create Free Account
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            ) : (
              <Link to="/items/new" className="btn btn-primary">
                Submit New Report
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
