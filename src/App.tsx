import Home from "./Home";
import SignUpPage from "./SignUp";
import SignInPage from "./SignIn";
import Account from "./Account";
import HOW from "./HOW";

import { HashRouter, Route, Routes, Navigate } from "react-router-dom";

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Default route redirects to /home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Define all other routes */}
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/howitworks" element={<HOW />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/account/*" element={<Account />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
