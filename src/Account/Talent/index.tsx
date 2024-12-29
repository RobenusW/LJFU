import Editor from "./Editor";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
export default function Talent() {
  return (
    <Routes>
      <Route path=":uid/editor" element={<Editor />} />
      <Route path=":uid/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
