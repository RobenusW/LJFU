import { Routes, Route } from "react-router-dom";
import CreateProfile from "./CreateProfile";
import SavedResumes from "./savedResumes";
import ResumesDashboard from "./Dashboard";

export default function Business() {
  return (
    <div>
      <Routes>
        <Route path="/createprofile" element={<CreateProfile />} />
        <Route path="/savedresumes" element={<SavedResumes />} />
        <Route path="/resumes" element={<ResumesDashboard />} />
      </Routes>
    </div>
  );
}
