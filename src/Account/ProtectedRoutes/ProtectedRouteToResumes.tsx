import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRouteToResumes() {
  const { user } = useAuth();
  const location = useLocation();

  // Don't interfere with business routes
  if (location.pathname.startsWith('/business/')) {
    return <Outlet />;
  }

  if (!user) {
    return <Outlet />; // Let non-authenticated users see auth screens
  }

  // Only redirect if role not chosen
  if (user.user_metadata?.chosen_role === undefined) {
    return <Navigate to="/initiate" replace />;
  }

  return <Outlet />;
}
