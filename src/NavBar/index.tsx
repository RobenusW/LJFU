import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../Account/supabase";

export default function NavBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user: authenticated } = useAuth();

  const handleSignout: () => Promise<void> = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error during signout:", error);
    } else {
      navigate("/signin");
    }
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px 40px",
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(5px)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 1000,
      }}
    >
      {/* Left side - Logo and main nav */}
      <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
        <a
          href="/"
          style={{
            fontSize: "18px",
            fontWeight: "700",
            textDecoration: "none",
            color: "#000",
          }}
        >
          LetJobsFindYou.com
        </a>

        <div style={{ display: "flex", gap: "24px" }}>
          {!authenticated && (
            <button
              onClick={() => {
                const element = document.getElementById("how-it-works");
                if (element) {
                  const headerOffset = 100; // Adjust this value based on your navbar height
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition =
                    elementPosition + window.pageYOffset - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
              }}
              style={{
                background: "none",
                border: "none",
                padding: "8px 12px",
                color: pathname.includes("how") ? "#000" : "#666",
                fontWeight: pathname.includes("how") ? "600" : "400",
              }}
            >
              How It Works
            </button>
          )}

          <button
            onClick={() => navigate("/companies")}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              color: pathname.includes("companies") ? "#000" : "#666",
              fontWeight: pathname.includes("companies") ? "600" : "400",
            }}
          >
            Companies
          </button>

          <button
            onClick={() => navigate("/resumeuploads")}
            style={{
              background: "none",
              border: "none",
              padding: "8px 12px",
              color: pathname.includes("resumeuploads") ? "#000" : "#666",
              fontWeight: pathname.includes("resumeuploads") ? "600" : "400",
            }}
          >
            Resumes
          </button>
        </div>
      </div>

      {/* Right side - Action buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {authenticated?.role === "talent" && (
          <button
            onClick={() => navigate(`/${authenticated.id}/editor`)}
            style={{
              background: "none",
              border: "1px solid #000",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "500",
            }}
          >
            Editor
          </button>
        )}

        {!authenticated && (
          <button
            onClick={() =>
              navigate(pathname.includes("business") ? "/talent" : "/business")
            }
            style={{
              background: "none",
              border: "1px solid #000",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "500",
              color: "#000",
            }}
          >
            {pathname.includes("business") ? "I am Talent" : "I am a Business"}
          </button>
        )}

        <button
          onClick={() => {
            if (authenticated) {
              handleSignout();
            } else {
              navigate("/signin");
            }
          }}
          style={{
            background: "#000",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "8px",
            fontWeight: "500",
          }}
        >
          {authenticated ? "Log out" : "Log in"}
        </button>
      </div>
    </nav>
  );
}
