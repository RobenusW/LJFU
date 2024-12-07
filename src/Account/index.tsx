import { Route, Routes, HashRouter } from "react-router-dom";
import Editor from "./Editor";

export default function Account() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </HashRouter>
  );
}
