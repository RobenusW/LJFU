import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../../store";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = useSelector(
    (state: RootState) => state.account.currentUser
  );

  if (currentUser && currentUser.role === "business") {
    return children;
  } else {
    return <Navigate to="/signin" />;
  }
}
