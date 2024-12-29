import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useSelector(
    (state: RootState) => state.account.currentUser
  );

  if (currentUser && currentUser.role === "business") {
    console.log("Business user");
    return children;
  } else {
    if (currentUser && currentUser.role === "talent") {
      alert("Must be a business to access this page");
      return <Navigate to="/home" />;
    } else {
      console.log("Redirecting to signin");
      return <Navigate to="/signin" />;
    }
  }
}
