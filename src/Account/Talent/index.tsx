import Editor from "./Editor";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
export default function Talent() {
  return (
    <Routes>
      <Route path="/editor" element={<Editor />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
