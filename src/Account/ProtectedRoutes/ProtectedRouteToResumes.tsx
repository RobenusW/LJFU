import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRouteToResumes() {
  const { user } = useAuth();

  // Let non-authenticated users access routes
  if (!user) {
    return <Outlet />;
  }

  // Redirect to initiate if role not chosen
  if (user.user_metadata?.chosen_role === undefined) {
    return <Navigate to="/initiate" replace />;
  }
  // else if talent go to resources and business go to res
  else if (user.user_metadata?.chosen_role === "talent")
    return <Navigate to="/talent/editor" replace />;
  else if (user.user_metadata?.chosen_role === "business")
    return <Navigate to="/business/resumes" replace />;

  return <Outlet />;
}
