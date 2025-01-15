import Editor from "./Editor";
import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Talent() {
  const { user } = useAuth();
  return (
    <Routes>
      {user ? (
        <Route path="/editor" element={<Editor />} />
      ) : (
        <Navigate to="/signin" replace />
      )}
    </Routes>
  );
}
