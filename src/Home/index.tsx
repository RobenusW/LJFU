import NavBar from "../NavBar";
import "./index.css";
import FAQ from "./FAQ";
import Footer from "./Footer";
import LogoCarousel from "./LogoCarousel";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  let userType = "business";
  if (pathname.includes("talent")) {
    userType = "talent";
  }

  return (
    <section>
      <NavBar />
      {/* Hero Section */}
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "120px 20px 80px 20px",
        }}
      >
        <h1
          className="main-heading"
          style={{
            fontSize: "72px",
            fontWeight: "700",
            lineHeight: "1.2",
            textAlign: "center",
            marginBottom: "24px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          {userType === "business"
            ? "Stop Waiting for Talent To Apply."
            : "Let Jobs Find You."}
        </h1>

        <p
          className="subtitle"
          style={{
            fontSize: "20px",
            color: "#666",
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 40px",
          }}
        >
          {userType === "business"
            ? "Get unparalleled access to thousands of top-tier candidates instantly."
            : "One Resume, No Cover Letters. We promise."}
        </p>

        <div className="cta-buttons" style={{ textAlign: "center" }}>
          <button
            className="primary-button"
            style={{
              background: "#000",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "8px",
              marginRight: "16px",
            }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Get started
          </button>
        </div>
      </div>
      <LogoCarousel />
      <section
        id="how-it-works"
        style={{
          padding: "100px 20px",
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "48px",
            textAlign: "center",
            marginBottom: "60px",
            fontWeight: "600",
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "40px",
            marginBottom: "60px",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              👤
            </div>
            <h3 style={{ marginBottom: "15px" }}>Create Business Profile</h3>
            <p style={{ color: "#666" }}>
              Fill out your company details and job requirements.
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              🎯
            </div>
            <h3 style={{ marginBottom: "15px" }}>Get Matched</h3>
            <p style={{ color: "#666" }}>
              Filter our thousands of candidates for skills, university,
              experience, past employment and more. We'll analyze your job
              requirements to recommend candidates who match your company's
              needs
            </p>
          </div>

          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              💼
            </div>
            <h3 style={{ marginBottom: "15px" }}>Connect with Talent</h3>
            <p style={{ color: "#666" }}>
              Review matched candidates and connect directly with those who fit
              your needs. No more endless resume screening.
            </p>
          </div>
        </div>
      </section>
      <div
        style={{
          padding: "80px 20px",
          backgroundColor: "#fff",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "48px",
            fontWeight: "600",
            marginBottom: "24px",
          }}
        >
          {userType === "business"
            ? "Don't Compromise on Your Most Valuable Asset"
            : "The Job Seeking Process is Broken"}
        </h2>
        <p
          style={{
            fontSize: "20px",
            color: "#444",
            maxWidth: "800px",
            margin: "0 auto 32px",
            lineHeight: "1.6",
          }}
        >
          {userType === "business"
            ? `Your team is the cornerstone of your success and settling for anything ` +
              `less than exceptional talent simply isn't an option. Hiring ` +
              `sub-standard talent will ultimately cost more than investing in the ` +
              `right talent from the start.`
            : "Talent should not have to apply to hundreds of jobs, write meaningless cover letters, and wait for weeks to hear back. We hear you."}
        </p>
        <button
          className="primary-button"
          style={{
            background: "#000",
            color: "#fff",
            padding: "12px 32px",
            borderRadius: "8px",
            fontSize: "18px",
          }}
        >
          {userType === "business" ? "Get Access Now" : "Upload Your Resume"}
        </button>
      </div>
      <div className="container">
        <section
          style={{
            padding: "100px 20px",
            maxWidth: "1200px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "48px",
              marginBottom: "30px",
              fontWeight: "600",
            }}
          >
            {userType === "business"
              ? "Stop Paying Large Recruiting Teams"
              : "More Time to Focus on Improving Your Skills"}
          </h2>
          <p
            style={{
              fontSize: "20px",
              color: "#666",
              maxWidth: "800px",
              margin: "0 auto 40px",
              lineHeight: "1.6",
            }}
          >
            {userType === "business"
              ? `Traditional recruiting is expensive and time-consuming. Our platform ` +
                `helps you find the right talent at a fraction of the cost. No more ` +
                `need for large recruiting teams or expensive agencies.`
              : "Traditional job seeking is broken. You should not have to apply to hundreds of jobs, write meaningless cover letters, and wait for weeks to hear back. We hear you."}
          </p>

          <button
            className="primary-button"
            style={{
              background: "#000",
              color: "#fff",
              padding: "12px 32px",
              borderRadius: "8px",
              fontSize: "18px",
            }}
          >
            See Pricing
          </button>
        </section>
      </div>

      <FAQ />
      <Footer />
    </section>
  );
}
