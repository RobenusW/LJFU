import { CheckCircleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();
  return (
    <div
      className="pricing-container"
      style={{
        padding: "40px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "16px",
          }}
        >
          Affordable <span style={{ color: "#1890ff" }}>Simple</span> Pricing.
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          padding: "20px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "32px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "400px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              fontWeight: "700",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontSize: "24px" }}>$</span>600
            <span
              style={{ fontSize: "16px", fontWeight: "normal", color: "#666" }}
            >
              /year
            </span>
          </div>

          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "#000000",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginBottom: "24px",
              transition: "background 0.3s",
            }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Get Started Now
          </button>

          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "16px" }}>
              What's included in this price?{" "}
              <span style={{ color: "#1890ff" }}>Everything.</span>
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {[
                "Unlimited access to talent",
                "AI-powered recruiter (coming soon)",
                "No hidden fees",
              ].map((feature, index) => (
                <div
                  key={index}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "#666",
              textAlign: "center",
              marginTop: "16px",
            }}
          >
            100% Money Back Guarantee, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}
