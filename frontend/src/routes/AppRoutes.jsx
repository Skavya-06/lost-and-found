import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import ItemsList from '../pages/ItemsList';
import ItemDetail from '../pages/ItemDetail';
import ItemForm from '../pages/ItemForm';
import MyItems from '../pages/MyItems';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';
import PublicOnlyRoute from '../components/common/PublicOnlyRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="items" element={<ItemsList />} />
        <Route path="items/:id" element={<ItemDetail />} />

        {/* Public-Only Auth Routes */}
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
              <ItemForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="items/:id/edit"
          element={
            <ProtectedRoute>
              <ItemForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-items"
          element={
            <ProtectedRoute>
              <MyItems />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* 404 Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
