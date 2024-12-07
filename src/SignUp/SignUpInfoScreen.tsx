import React from "react";
import { Link } from "react-router-dom";

export default function SignUpPage() {
  return (
    <div className="signup-container bg-dark vh-100 d-flex justify-content-center align-items-center">
      <div
        className="card p-4 shadow"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Sign Up</h2>
        <form>
          {/* Username Field */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Enter your username"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              required
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
            />
          </div>

          <div className="d-flex mt-4">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="userType"
                id="business"
                value="business"
              />
              <label className="form-check-label" htmlFor="business">
                I am a business
              </label>

              {/* Talent Radio Button*/}
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="userType"
                id="talent"
                value="talent"
              />
              <label className="form-check-label" htmlFor="talent">
                I am a talent
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Sign Up
          </button>
        </form>

        {/* Already Have an Account Section */}
        <div className="text-center mt-3">
          <p className="mb-0">
            Have an account already?{" "}
            <Link to="/signin" className="text-primary">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
