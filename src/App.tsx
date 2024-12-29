import Home from "./Home";
import SignUpPage from "./SignUp";
import SignInPage from "./SignIn";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Business from "./Account/Business";
import Talent from "./Account/Talent";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the default route to /home */}
        <Route path="/" element={<Navigate to="/talent" replace />} />
        <Route path="/talent" element={<Home />} />
        <Route path="/talent/*" element={<Talent />} />
        {/* Business Routes */}
        <Route path="/business/*" element={<Business />} />
        <Route path="/business" element={<Home />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
