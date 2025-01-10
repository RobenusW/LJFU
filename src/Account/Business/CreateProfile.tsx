import React, { useState } from "react";
import NavBar from "../../NavBar";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../Account/supabase";
const maxDescriptionLength = 65;
const businessNameMaxLength = 20;

export default function CreateProfile() {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [description, setDescription] = useState("");

  const { user } = useAuth();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateUser();
  };

  const updateUser = async () => {
    if (!logo) {
      console.error("Logo is required");
      return;
    } else if (name === "") {
      console.error("Name is required");
      return;
    } else if (description === "") {
      console.error("Description is required");
      return;
    }

    try {
      if (user && user.user_metadata.chosen_role === undefined) {
        supabase.auth.updateUser({
          data: {
            chosen_role: "business",
          },
        });
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error updating user metadata:", error);
    }
  };

  const handleCreateBusiness = async () => {
    const { data, error } = await supabase.from("businesses").insert({
      business_name: name,
      logo_location: logo,
      description: description,
    });
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
            <div className="mb-3">
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
                maxLength={businessNameMaxLength}
              />
              <div id="nameSub" className="form-text text-muted">
                Max: {businessNameMaxLength} characters
              </div>
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
                <p
                  style={{
                    fontSize: "12px",
                    maxWidth: "200px", // adjust as needed
                    wordWrap: "break-word", // ensures long words break
                    overflowWrap: "break-word", // modern name for the same rule
                    whiteSpace: "normal", // ensure text can break across lines
                  }}
                >
                  {description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
