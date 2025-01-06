import Home from "./Home";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Business from "./Account/Business";
import Talent from "./Account/Talent";
import AuthScreen from "./Account/AuthScreen";
import { AuthProvider } from "./AuthContext";
import Dashboard from "./Account/Dashboard";
import ProtectedRouteToDashboard from "./Account/ProtectedRouteToDashboard";
import ProtectedRouteToSignin from "./ProtectedRouteToSignin";
import Intiated from "./Account/Intiated";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRouteToDashboard />}>
            <Route path="/signin" element={<AuthScreen />} />
            <Route path="/signup" element={<AuthScreen />} />
            <Route path="/home" element={<Navigate to="/talent" replace />} />
          </Route>

          <Route element={<ProtectedRouteToSignin />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRouteToSignin />}>
            <Route path="/initiated" element={<Intiated />} />
          </Route>

          <Route path="/" element={<Navigate to="/talent" replace />} />

          <Route path="/talent" element={<Home />} />
          <Route path="/talent/*" element={<Talent />} />
          {/* Business Routes */}
          <Route path="/business" element={<Home />} />
          <Route path="/business/*" element={<Business />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
