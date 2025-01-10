import Home from "./Home";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Business from "./Account/Business";
import Talent from "./Account/Talent";
import AuthScreen from "./Account/AuthScreen";
import { AuthProvider } from "./AuthContext";
import Dashboard from "./Account/Dashboard";
import ProtectedRouteToDashboard from "./Account/ProtectedRoutes/ProtectedRouteToDashboard";
import ProtectedRouteToSignin from "./Account/ProtectedRoutes/ProtectedRouteToSignin";
import Initiated from "./Account/Initiated";
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<ProtectedRouteToDashboard />}>
            <Route path="/signup" element={<AuthScreen />} />
            <Route path="/signin" element={<AuthScreen />} />
            <Route path="/home" element={<Navigate to="/talent" replace />} />
            <Route path="/" element={<Navigate to="/talent" replace />} />
            <Route path="/talent" element={<Home />} />
            <Route path="/business" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<ProtectedRouteToSignin />}>
            <Route path="/initiate" element={<Initiated />} />
          </Route>

          <Route path="/talent/*" element={<Talent />} />
          <Route path="/business/*" element={<Business />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
