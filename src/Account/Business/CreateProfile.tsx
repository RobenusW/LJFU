import React, { useState } from "react";
import NavBar from "../../NavBar";
import { createBusiness } from "./client";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const industries = [
  "Agriculture",
  "Manufacturing",
  "Energy",
  "Healthcare",
  "Software",
  "Information Technology (IT)",
  "Financial Services",
  "Retail",
  "Education",
  "Construction",
  "Transportation",
  "Hospitality and Tourism",
  "Telecommunications",
  "Real Estate",
  "Media and Entertainment",
  "Automotive",
  "Mining and Natural Resources",
  "Government and Public Sector",
  "Aerospace and Defense",
  "Food and Beverage",
  "Environmental Services",
];

const maxDescriptionLength = 60;

export default function CreateProfile() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [industry, setIndustry] = useState("");
  const navigate = useNavigate();
  const { uid } = useParams();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleCreateBusiness();
  };

  const handleCreateBusiness = async () => {
    if (!logo) {
      console.error("Logo is required");
      return;
    }

    try {
      const business = await createBusiness({
        name,
        logo,
        description,
        industry,
      });
      navigate(`/business/${uid}/dashboard`);
    } catch (error) {
      console.error("Error creating business", error);
    }
  };

  return (
    <div style={{ background: "#fff", padding: "20px" }}>
      <NavBar />
      <div
        className="container"
        style={{ position: "relative", marginTop: "50px" }}
      >
        <div
          className="d-flex justify-content-center align-items-start"
          style={{
            minHeight: "80vh",
            display: "flex",
            gap: "40px",
            marginTop: "100px",
          }}
        >
          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            style={{ maxWidth: "600px", width: "100%" }}
          >
            <h2 className="text-center mb-4">Create Profile</h2>

            {/* Name Field */}
            <div className="mb-10">
              <label htmlFor="name" className="form-label mb-6">
                Business Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Logo Upload */}
            <div className="mb-3">
              <label htmlFor="logo" className="form-label">
                Upload Logo
              </label>
              <input
                type="file"
                className="form-control"
                id="logo"
                accept="image/*"
                required
                onChange={(e) =>
                  setLogo(e.target.files ? e.target.files[0] : null)
                }
              />
              <div id="logoHelp" className="form-text text-muted">
                Optimal size: 100x100px
              </div>
            </div>

            {/* Description Field */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                placeholder="Enter a description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={maxDescriptionLength}
              />
              <div id="descriptionSub" className="form-text text-muted">
                Max: {maxDescriptionLength} characters
              </div>
            </div>

            {/* Industry Dropdown */}
            <div className="mb-3">
              <label htmlFor="industry" className="form-label">
                Industry
              </label>
              <select
                className="form-control"
                id="industry"
                required
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="" disabled>
                  Select an industry
                </option>
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-dark w-100">
              Submit
            </button>
          </form>

          {/* Profile Preview Section */}
          <div className="container">
            <h2>Profile Preview</h2>
            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                border: "1px solid #ddd",
                borderRadius: "8px",
                paddingRight: "1px",
                display: "flex",
                alignItems: "center",
                gap: "20px",
                height: "100px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {logo && (
                  <img
                    src={URL.createObjectURL(logo)}
                    alt="Logo Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", // Ensures the image fills the container without stretching
                      borderRadius: "8px",
                    }}
                  />
                )}
              </div>
              <div>
                <h3>{name}</h3>
                <p style={{ fontSize: "12px" }}>{description}</p>
                <span
                  style={{
                    display: "inline-block",
                    background: "#eee",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontSize: "12px",
                    color: "#333",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {industry}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
