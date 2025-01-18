import Editor from "./Editor";
import { Route, Routes } from "react-router-dom";

export default function Talent() {
  return (
    <Routes>
      <Route path="/editor" element={<Editor />} />
    </Routes>
  );
}
