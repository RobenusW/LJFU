import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import * as userClient from "../Account/client";
import { setCurrentUser } from "../Account/AccountReducer";
import { useDispatch } from "react-redux";
import NavBar from "../NavBar";

export default function SignInPage() {
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [credientials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const signin = async (event: React.FormEvent) => {
    try {
      event.preventDefault();
      const user = await userClient.signin(credientials);
      dispatch(setCurrentUser(user));

      if (user.role === "talent") {
        navigate(`/talent/${user._id}/editor`);
      } else {
        navigate(`/${user._id}/resumeuploads`);
      }
    } catch (error: any) {
      if (error.status === 401) {
        setError(error.response.data);
      }
      setError("An error occurred while signing in.");
    }
  };

  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <div
          className="card p-4 shadow"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <h2 className="text-center mb-4">Sign In</h2>
          <form onSubmit={signin}>
            {/* Error Message */}
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
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
                onChange={(e) =>
                  setCredentials({ ...credientials, email: e.target.value })
                }
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
                onChange={(e) =>
                  setCredentials({ ...credientials, password: e.target.value })
                }
              />
            </div>

            {/* Sign In Button */}
            <button type="submit" className="btn btn-dark w-100">
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-3">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="text-dark">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
