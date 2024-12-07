import { useLocation, useNavigate } from "react-router-dom";
import TypeText from "./TypeText";
import NavBar from "../NavBar.tsx";
import { Link } from "react-router-dom";

export default function Home() {
  const { pathname } = useLocation();

  let text = [];
  if (pathname.includes("business")) {
    text = [
      "Find the Best Talent.",
      "No More Waiting for Talent.",
      "Filter for Skills, Experience, and More.",
    ];
  } else {
    text = [
      "Let Jobs Find You.",
      "One Resume.",
      "No Cover Letters.",
      "One Click.",
    ];
  }

  return (
    <div className="d-flex flex-column vh-100 position-relative">
      <NavBar />
      <div className="position-absolute top-50 start-50 translate-middle text-center">
        <TypeText texts={text} />
        <Link to="/signup" className="btn btn-success mt-3">
          Get Started
        </Link>
      </div>
    </div>
  );
}
