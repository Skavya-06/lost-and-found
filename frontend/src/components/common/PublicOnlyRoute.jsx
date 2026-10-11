import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const origin = location.state?.from?.pathname || '/';
    return <Navigate to={origin} replace />;
  }

  return children;
}
