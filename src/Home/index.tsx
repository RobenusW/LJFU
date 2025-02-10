import NavBar from "../NavBar/index.tsx";
import "./index.css";
import FAQ from "./FAQ.tsx";
import Footer from "./Footer.tsx";
import Pricing from "./Pricing.tsx";
import LogoCarousel from "./LogoCarousel.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

export default function Home() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [businessPath, setBusinessPath] = useState(
    pathname.includes("business")
  );

  useEffect(() => {
    setBusinessPath(pathname.includes("business"));
  }, [pathname]);

  let userType = "business";
  if (!businessPath) {
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

        <p className="subtitle">
          {userType === "business"
            ? "Get unparalleled access to thousands of top-tier candidates instantly. (Coming Soon!)"
            : "One Resume. No Cover Letters. We promise."}
        </p>

        <div style={{ textAlign: "center" }}>
          <button
            className="black-button"
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
            <h3 style={{ marginBottom: "15px" }}>
              {userType === "business"
                ? "Create Business Profile"
                : "Upload Resume"}
            </h3>
            <p style={{ color: "#666" }}>
              {userType === "business"
                ? "Create a profile for your business and upload your logo."
                : "Upload your resume and few short details about your skills."}
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
              {userType === "business"
                ? "Filter our thousands of candidates for skills, university, experience, and more"
                : "Businesses will view your resumes and email  you if they think you are a good fit. We're truly always doing our best to make sure your resume gets the attention it deserves."}
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
            <h3 style={{ marginBottom: "15px" }}>
              {userType === "business"
                ? "Connect with Talent"
                : "Improve Your Resume"}
            </h3>
            <p style={{ color: "#666" }}>
              {userType === "business"
                ? "Review matched candidates and connect directly with those who fit your needs. No more endless resume screening."
                : "With the saved time and energy, develop your skills and improve your resume by working on projects and completing courses. Check out our high-quality resources."}
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
          onClick={() => {
            navigate("/signup");
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
        </section>
        {userType === "business" && (
          <section id="pricing">
            <Pricing />
          </section>
        )}
      </div>
      {/* FAQ Section */}
      <div id="faq">
        <FAQ />
      </div>

      <Footer />
    </section>
  );
}
