import Home from "./Home/index.tsx";

import { Route, Routes, Navigate } from "react-router-dom";
import Business from "./Account/Business/index.tsx";
import Talent from "./Account/Talent/index.tsx";
import AuthScreen from "./Account/AuthScreen.tsx";
import { AuthProvider } from "./AuthContext.tsx";
import ProtectedRouteToResumes from "./Account/ProtectedRoutes/ProtectedRouteToResumes.tsx";
import ProtectedRouteToSignin from "./Account/ProtectedRoutes/ProtectedRouteToSignin.tsx";
import Initiated from "./Account/Initiated.tsx";
import Resources from "./Account/Talent/Resources.tsx";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<ProtectedRouteToResumes />}>
          <Route path="/signup" element={<AuthScreen />} />
          <Route path="/signin" element={<AuthScreen />} />
          <Route
            path="/home"
            element={<Navigate to="/home/talent" replace />}
          />
          <Route path="/" element={<Navigate to="/home/talent" replace />} />
          <Route path="home/talent" element={<Home />} />
          <Route path="home/business" element={<Home />} />
        </Route>

        <Route element={<ProtectedRouteToSignin />}>
          <Route path="/initiate" element={<Initiated />} />
        </Route>

        <Route path="/talent/*" element={<Talent />} />
        <Route path="/business/*" element={<Business />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </AuthProvider>
  );
}
