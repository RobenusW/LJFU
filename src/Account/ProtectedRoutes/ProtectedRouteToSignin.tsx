import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRouteToSignin() {
  const user = useAuth();
  if (!user) {
    console.log("User is NOT logged in");
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
}
