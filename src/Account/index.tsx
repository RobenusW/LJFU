import Session from "./Session";
import { Routes, Route } from "react-router-dom";
import Business from "./Business";
import { useLocation } from "react-router-dom";

export default function Account() {
  const location = useLocation();
  console.log(location.pathname);
  return (
    <Session>
      <Routes>
        <Route path="/business/*" element={<Business />} />
      </Routes>
    </Session>
  );
}
