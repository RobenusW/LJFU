import { useState } from "react";
import NavBar from "../NavBar";
import { useNavigate } from "react-router-dom";

export default function Initiated() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const nextPage = () => {
    if (role === "talent") {
      navigate(`/talent/editor`, { replace: true });
    } else if (role === "business") {
      navigate("/business/resumes", { replace: true });
    }
    //   const { data } = await supabase.auth.getSession();

    //   const link =
    //     SubscriptionPlans[0].link +
    //     "?prefilled_email=" +
    //     data.session?.user?.email;
    //   window.open(link, "_blank");
    // }
  };

  return (
    <div>
      <NavBar />
      {/* Full-page container, flexbox for vertical/horizontal centering */}
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        {/* Card Container */}
        <div
          className="card p-4 shadow"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4">Select Your Role</h2>
          <div className="mb-3">
            <div className="d-flex justify-content-center">
              {/* Talent Radio */}
              <div className="form-check me-4">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleTalent"
                  value="talent"
                  checked={role === "talent"}
                  onChange={() => setRole("talent")}
                  required
                />
                <label className="form-check-label" htmlFor="roleTalent">
                  Talent
                </label>
              </div>
              {/* Business Radio */}
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  disabled
                  name="role"
                  id="roleBusiness"
                  value="business"
                  checked={role === "business"}
                  onChange={() => setRole("business")}
                />
                <label className="form-check-label" htmlFor="roleBusiness">
                  Business (Coming Soon!)
                </label>
              </div>
            </div>
          </div>

          {/* Next Button */}
          {role !== "" && (
            <div className="d-flex justify-content-center">
              <button className="btn btn-dark mt-3" onClick={nextPage}>
                Next <span className="ms-2">&#8594;</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
