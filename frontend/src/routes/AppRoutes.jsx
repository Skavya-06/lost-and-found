import { Routes, Route, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';
import PublicOnlyRoute from '../components/common/PublicOnlyRoute';
import { Package, ShieldCheck, PlusCircle, ArrowRight } from 'lucide-react';

/**
 * Teaser page for Item pages (implemented in PR 2)
 */
function ItemsTeaserPage() {
  return (
    <div className="teaser-page-container">
      <div className="teaser-card">
        <div className="teaser-icon-box">
          <Package size={36} />
        </div>
        <span className="badge badge-accent">Coming in PR 2</span>
        <h2>Lost & Found Items Catalog</h2>
        <p>
          The complete items directory with search, type filters (LOST / FOUND), status filters
          (OPEN / CLAIMED / CLOSED), category filters, and owner contact details is scheduled for
          <strong> Pull Request 2</strong>.
        </p>
        <div className="teaser-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
          <Link to="/login" className="btn btn-primary">
            <span>Sign In / Test Auth</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Teaser page for Admin Dashboard (implemented in PR 2)
 */
function AdminTeaserPage() {
  return (
    <div className="teaser-page-container">
      <div className="teaser-card">
        <div className="teaser-icon-box admin-icon-box">
          <ShieldCheck size={36} />
        </div>
        <span className="badge badge-admin">Admin Route Verified</span>
        <h2>Admin Management Dashboard</h2>
        <p>
          You have successfully authenticated with <strong>Admin Privileges</strong>! The full
          admin metrics, bulk status updates (OPEN / CLAIMED / CLOSED), and deletion controls are
          slated for <strong>Pull Request 2</strong>.
        </p>
        <div className="teaser-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
          <Link to="/profile" className="btn btn-primary">
            View Admin Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Teaser page for Report Item Form (implemented in PR 2)
 */
function ReportTeaserPage() {
  return (
    <div className="teaser-page-container">
      <div className="teaser-card">
        <div className="teaser-icon-box">
          <PlusCircle size={36} />
        </div>
        <span className="badge badge-accent">Coming in PR 2</span>
        <h2>Submit New Lost/Found Report</h2>
        <p>
          The item submission form featuring photo upload, category selection, location details,
          and contact info is scheduled for <strong>Pull Request 2</strong>.
        </p>
        <div className="teaser-actions">
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="items" element={<ItemsTeaserPage />} />
        <Route path="items/:id" element={<ItemsTeaserPage />} />

        {/* Public-only auth routes (redirects if already logged in) */}
        <Route
          path="login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="items/new"
          element={
            <ProtectedRoute>
              <ReportTeaserPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-items"
          element={
            <ProtectedRoute>
              <ItemsTeaserPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminTeaserPage />
            </AdminRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
