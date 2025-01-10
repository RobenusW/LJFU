import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRouteToDashboard() {
  const { user } = useAuth();
  if (user) {
    if (user.user_metadata?.chosen_role === undefined) {
      return <Navigate to="/initiate" replace />;
    } else if (user.user_metadata?.chosen_role === "talent") {
      console.log("navigating to talent dashboard");
      return <Navigate to="/talent/dashboard" replace />;
    } else if (user.user_metadata?.chosen_role === "business") {
      console.log("navigating to business dashboard");
      return <Navigate to="/business/dashboard" replace />;
    } else {
      throw new Error("User role not found");
    }
  }

  console.log("User is not logged in");
  return <Outlet />;
}
