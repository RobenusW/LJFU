import { Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRouteToSignin() {
  const user = useAuth();
  console.log("here", user);

  return <Outlet />;
}
