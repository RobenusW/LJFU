import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../Account/AccountReducer";
import { useDispatch } from "react-redux";
import NavBar from "../NavBar";
import { supabase } from "../Account/supabase";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Default role
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    dispatch(setCurrentUser(data));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await currentUser();

      if (role === "talent") {
        navigate(`/talent/${currentUser._id}/editor`);
        return;
      } else {
        navigate(`/business/${currentUser._id}/createprofile`);
      }
    } catch (error: any) {
      if (error.status === 409) {
        setError(error.response.data);
      } else {
        setError("An error occurred while signing up.");
      }
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh", background: "#fff" }}
    >
      <NavBar />

      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%", margin: "100px" }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Role:</label>
            <div className="d-flex">
              <div className="form-check me-3">
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
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="roleBusiness"
                  value="business"
                  checked={role === "business"}
                  onChange={() => setRole("business")}
                />
                <label className="form-check-label" htmlFor="roleBusiness">
                  Business
                </label>
              </div>
            </div>
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm your password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-dark w-100 mt-3">
            Sign Up
          </button>
        </form>

        {/* Already Have an Account Section */}
        <div className="text-center mt-3">
          <p className="mb-0">
            Have an account already?{" "}
            <Link to="/signin" className="text-dark">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
