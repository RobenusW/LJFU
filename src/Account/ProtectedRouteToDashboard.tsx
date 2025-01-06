import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRouteToDashboard() {
  const { user } = useAuth();

  if (user) {
    console.log("User is logged in");
    return <Navigate to="/dashboard" replace />;
  }
  console.log("User is not logged in");

  return <Outlet />;
}
