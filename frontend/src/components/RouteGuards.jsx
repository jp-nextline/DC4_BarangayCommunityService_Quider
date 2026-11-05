import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from './Loader.jsx';

/** Requires login; with adminOnly also requires the admin role (Laravel enforces it again). */
export function ProtectedRoute({ adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loader label="Checking your session…" />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
}

/** Login/register pages: logged-in users are sent to the dashboard. */
export function GuestRoute() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
