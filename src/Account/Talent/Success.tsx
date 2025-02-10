import { BadgeCheck } from "lucide-react";
import "../../App.css";
import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        gap: "4px",
        textAlign: "center",
      }}
    >
      <div>
        <BadgeCheck color="#28a745" size={250} />
      </div>

      <h2>Resume Uploaded Successfully!</h2>
      <p className="subtitle" style={{ marginBottom: "20px" }}>
        Check out our resources to improve your programming skills.
      </p>
      <button onClick={() => navigate("/resources")} className="black-button">
        Continue to Resources & Home Page
      </button>
    </div>
  );
};

export default Success;
