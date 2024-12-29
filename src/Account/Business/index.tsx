import { Routes, Route } from "react-router-dom";
import CreateProfile from "./CreateProfile";
import Dashboard from "./ResumeDashboard";
import { findAllResumes } from "../Talent/resumeClient";
import { useState, useEffect } from "react";
export default function Business() {
  const [resumes, setResumes] = useState([]);
  const fetchResumes = async () => {
    try {
      const resumes = await findAllResumes();
      setResumes(resumes);
    } catch (error) {
      console.error("Error fetching resumes", error);
    }
  };
  useEffect(() => {
    fetchResumes();
  }, []);
  return (
    <div>
      <Routes>
        <Route path=":uid/createprofile" element={<CreateProfile />} />
        <Route
          path=":uid/dashboard"
          element={<Dashboard resumes={resumes} />}
        />
      </Routes>
    </div>
  );
}
