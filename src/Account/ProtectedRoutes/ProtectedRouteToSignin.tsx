import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRouteToSignin() {
  const user =  useAuth();
  console.log("here", user);

  if (user.user) {
    return <Outlet />;
  }
  return <Navigate to="/signin" replace />;
}
