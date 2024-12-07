import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function NavBar() {
  const { pathname } = useLocation();
  const links = ["how-it-works"];

  const navigate = useNavigate();

  // Add "pricing" link if the pathname includes "business"
  if (pathname.includes("business")) {
    links.push("pricing");
  }

  return (
    <nav className="position-fixed navbar navbar-expand-lg navbar-dark bg-dark bg-opacity-75 w-100">
      <div className="container-fluid">
        {/* Brand Name */}
        <a className="navbar-brand" href="#">
          LJFU
        </a>

        {/* Toggler Button for Mobile View */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {links.map((link, index) => (
              <li className="nav-item" key={index}>
                <a
                  className={`nav-link ${
                    pathname.includes(link) ? "active" : ""
                  }`}
                  aria-current="page"
                  onClick={() =>
                    navigate(
                      `/${
                        link.charAt(0).toUpperCase() +
                        link.replace(/-/g, "").slice(1)
                      }`
                    )
                  }
                >
                  {link.charAt(0).toUpperCase() +
                    link.replace(/-/g, " ").slice(1)}
                </a>
              </li>
            ))}
          </ul>

          {/* Conditional Button */}
          {pathname.includes("business") ? (
            <Link to="/talent" className="btn btn-secondary ms-2">
              I am Talent
            </Link>
          ) : (
            <Link to="/business" className="btn btn-secondary ms-2">
              I am a Business
            </Link>
          )}

          {/* Login Button */}
          <Link to="/signin" className="btn btn-primary ms-3">
            Log in
          </Link>
        </div>
      </div>
    </nav>
  );
}
