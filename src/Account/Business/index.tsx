import { Routes, Route } from "react-router-dom";
import CreateProfile from "./CreateProfile";

import Dashboard from "./Dashboard";
export default function Business() {
  return (
    <div>
      <Routes>
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
